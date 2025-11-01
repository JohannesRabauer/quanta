package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static dev.rabauer.quanta.backend.storage.FileMetadata.toAbsoluteFileString;

@ApplicationScoped
public class FileWatcherService {

    private static final Logger LOG = Logger.getLogger(FileWatcherService.class);
    @Inject
    FileMetadataRepository fileMetadataRepository;

    @Inject
    EmbeddingService embeddingService;

    @Inject
    TextExtractorService textExtractorService;

    @Inject
    SummarizerService summarizerService;

    @ConfigProperty(name = "quanta.filesystem.path")
    private String filesystemPathToWatch;

    @Scheduled(every = "600s")
    void checkFiles() {
        Path root = Paths.get(filesystemPathToWatch);

        LOG.infof("Starting file scan in path: %s", root);

        try (Stream<Path> paths = Files.walk(root)) {
            paths.filter(Files::isRegularFile).forEach(this::processFile);
        } catch (IOException e) {
            LOG.error("Error while scanning files", e);
        }
    }

    public void processFile(Path filePath) {
        try {
            long lastModified = Files.getLastModifiedTime(filePath).toMillis();
            FileMetadata existingMetadata = ensureMetadata(lastModified, filePath);

            if (existingMetadata.getLastModified() != lastModified) {
                // file changed
                onFileChanged(existingMetadata.getVectorUUID(), filePath, lastModified);
            } else {
                LOG.debugf("File unchanged: %s (lastModified=%d)", filePath, lastModified);
            }
        } catch (Exception e) {
            LOG.errorf(e, "Failed to process file: %s", filePath);
        }
    }

    @Transactional
    public FileMetadata ensureMetadata(long lastModified, Path filePath) {
        FileMetadata existingMetadata = fileMetadataRepository.findById(toAbsoluteFileString(filePath));

        if (existingMetadata == null || existingMetadata.getLastModified() == null) {
            // new file, store timestamp
            return fileMetadataRepository.saveMetadata(filePath.toString(), lastModified - 1, null);
        }
        return existingMetadata;
    }

    /**
     * Called whenever a file has changed or is new.
     */
    private void onFileChanged(String uuid, Path filePath, long lastModified) {
        LOG.infof("File changed: %s (lastModified=%d)", filePath, lastModified);
        String fileSummary = null;
        String content = textExtractorService.extractFromFile(filePath);
        if (content != null && !content.isBlank()) {
            fileSummary = summarizerService.summarize(content);
            embeddingService.embedFileWithContent(uuid, filePath, content, fileSummary);
        }
        updateMetadata(filePath, lastModified, fileSummary);
    }

    @Transactional
    public void updateMetadata(Path filePath, long lastModified, String fileSummary) {
        fileMetadataRepository.updateMetadata(toAbsoluteFileString(filePath), lastModified, fileSummary);
    }
}
