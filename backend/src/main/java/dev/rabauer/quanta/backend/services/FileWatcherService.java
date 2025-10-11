package dev.rabauer.quanta.backend.services;

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

    @Scheduled(every = "600s", delayed = "10s")
        // runs every 10 minutes, after finishing
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
            Long storedTimestamp = getStoredTimestampAndEnsureMetadata(lastModified, filePath);

            if (storedTimestamp == null || storedTimestamp != lastModified) {
                // file changed
                onFileChanged(filePath, lastModified);
            } else {
                LOG.debugf("File unchanged: %s (lastModified=%d)", filePath, lastModified);
            }
        } catch (Exception e) {
            LOG.errorf(e, "Failed to process file: %s", filePath);
        }
    }

    @Transactional
    public Long getStoredTimestampAndEnsureMetadata(long lastModified, Path filePath) {
        Long storedTimestamp = fileMetadataRepository.findLastModifiedByPath(filePath.toString());

        if (storedTimestamp == null) {
            // new file, store timestamp
            fileMetadataRepository.saveMetadata(filePath.toString(), lastModified, null);
        }
        return storedTimestamp;
    }

    /**
     * Called whenever a file has changed or is new.
     */
    private void onFileChanged(Path filePath, long lastModified) {
        LOG.infof("File changed: %s (lastModified=%d)", filePath, lastModified);
        String content = textExtractorService.extractFromFile(filePath);
        if (content != null && !content.isBlank()) {
            embeddingService.embedFileWithContent(filePath, content);
            String fileSummary = summarizerService.summarize(content);
            updateMetadata(filePath, lastModified, fileSummary);
        }
    }

    @Transactional
    public void updateMetadata(Path filePath, long lastModified, String fileSummary) {
        fileMetadataRepository.updateMetadata(toAbsoluteFileString(filePath), lastModified, fileSummary);
    }
}
