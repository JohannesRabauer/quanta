package dev.rabauer.quanta.backend.storage;

import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.store.storage.embedded.types.EmbeddedStorage;
import org.eclipse.store.storage.embedded.types.EmbeddedStorageManager;

import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class FileMetadataRepository {

    private final EmbeddedStorageManager storageManager;
    private final FileMetadataStore root;

    public FileMetadataRepository(
            @ConfigProperty(name = "quanta.eclipsestore.storage-path", defaultValue = "./eclipsestore-data") String storagePath) {
        this.storageManager = EmbeddedStorage.start(Paths.get(storagePath));
        if (storageManager.root() == null) {
            this.root = new FileMetadataStore();
            storageManager.setRoot(root);
            storageManager.storeRoot();
        } else {
            this.root = (FileMetadataStore) storageManager.root();
        }
    }

    @PreDestroy
    void shutdown() {
        storageManager.shutdown();
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata newFileMetadata = new FileMetadata(path, lastModified, summary, tags, relations);
        Map<String, FileMetadata> entries = root.getEntries();
        entries.put(path, newFileMetadata);
        storageManager.store(entries);
        return newFileMetadata;
    }

    public void updateMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata metadata = root.getEntries().get(path);
        if (metadata != null) {
            metadata.setLastModified(lastModified);
            metadata.setSummary(summary);
            metadata.setTags(tags);
            metadata.setRelations(relations);
            storageManager.store(metadata);
        }
    }

    public void updateTags(String path, String tags) {
        FileMetadata metadata = root.getEntries().get(path);
        if (metadata != null) {
            metadata.setTags(tags);
            storageManager.store(metadata);
        }
    }

    public FileMetadata findById(String path) {
        return root.getEntries().get(path);
    }

    public Optional<FileMetadata> findByIdOptional(String path) {
        return Optional.ofNullable(root.getEntries().get(path));
    }

    public List<FileMetadata> findByTag(String tag) {
        return root.getEntries().values().stream()
                .filter(m -> m.getTags() != null && m.getTags().contains(tag))
                .toList();
    }

    public void persist(FileMetadata metadata) {
        Map<String, FileMetadata> entries = root.getEntries();
        entries.put(metadata.getPath(), metadata);
        storageManager.store(entries);
    }

    public void deleteAll() {
        Map<String, FileMetadata> entries = root.getEntries();
        entries.clear();
        storageManager.store(entries);
    }
}
