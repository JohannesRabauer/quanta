package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.storage.FileMetadata;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import org.neo4j.ogm.session.Session;

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
    EmbeddingService embeddingService;

    @Inject
    org.neo4j.ogm.session.SessionFactory sessionFactory;

    @Inject
    TextExtractorService textExtractorService;

    @Inject
    SummarizerService summarizerService;

    @Inject
    TagAndRelationService tagAndRelationService;

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

            if (existingMetadata.getLastModified() == null || existingMetadata.getLastModified() != lastModified) {
                // file changed
                onFileChanged(existingMetadata, filePath, lastModified);
            } else {
                LOG.debugf("File unchanged: %s (lastModified=%d)", filePath, lastModified);
            }
        } catch (Exception e) {
            LOG.errorf(e, "Failed to process file: %s", filePath);
        }
    }

    @Transactional
    public FileMetadata ensureMetadata(long lastModified, Path filePath) {
        Session session = sessionFactory.openSession();
        FileMetadata existingMetadata = session.load(FileMetadata.class, toAbsoluteFileString(filePath));

        if (existingMetadata == null || existingMetadata.getLastModified() == null) {
            // new file, store timestamp — use absolute path so later lookups/updates match
            FileMetadata fileMetadata = new FileMetadata(toAbsoluteFileString(filePath), lastModified, null, null);
            session.save(fileMetadata);
            return fileMetadata;
        }
        return existingMetadata;
    }

    /**
     * Called whenever a file has changed or is new.
     */
    private void onFileChanged(FileMetadata fileMetadata, Path filePath, long lastModified) {
        LOG.infof("File changed: %s (lastModified=%d)", filePath, lastModified);
        String fileSummary = null;
        String tags = null;
        String relations = null;
        String content = textExtractorService.extractFromFile(filePath);
        if (content != null && !content.isBlank()) {
            fileSummary = summarizerService.summarize(content);
            String analysis = tagAndRelationService.analyze(content);
            if (analysis != null) {
                tags = extractFromAnalysis(analysis, "Tags:");
                relations = extractFromAnalysis(analysis, "Relations:");
            }
            embeddingService.embedFileWithContent(fileMetadata, filePath, content, fileSummary);
        }
        updateMetadata(filePath, lastModified, fileSummary, tags, relations);
    }

    private String extractFromAnalysis(String analysis, String prefix) {
        for (String line : analysis.split("\n")) {
            if (line.startsWith(prefix)) {
                return line.substring(prefix.length()).trim();
            }
        }
        return null;
    }

    @Transactional
    public void updateMetadata(Path filePath, long lastModified, String fileSummary, String tags, String relations) {
        Session session = sessionFactory.openSession();
        FileMetadata existingMetadata = session.load(FileMetadata.class, toAbsoluteFileString(filePath));
        if (existingMetadata != null) {
            existingMetadata.setLastModified(lastModified);
            existingMetadata.setSummary(fileSummary);
            existingMetadata.setRelations(relations);
            session.save(existingMetadata);
        }
    }
}
