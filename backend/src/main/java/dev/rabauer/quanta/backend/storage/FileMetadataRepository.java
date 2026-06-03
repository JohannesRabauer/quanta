package dev.rabauer.quanta.backend.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.store.storage.embedded.types.EmbeddedStorageManager;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class FileMetadataRepository {

    @Inject
    EmbeddedStorageManager storage;

    @Inject
    StorageRoot root;

    private Map<String, FileMetadata> store() {
        return root.getFileMetadataByPath();
    }

    public FileMetadata findById(String path) {
        return store().get(path);
    }

    public Optional<FileMetadata> findByIdOptional(String path) {
        return Optional.ofNullable(store().get(path));
    }

    public Long findLastModifiedByPath(String path) {
        FileMetadata metadata = findById(path);
        return metadata != null ? metadata.getLastModified() : null;
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata newFileMetadata = new FileMetadata(path, lastModified, summary, tags, relations);
        store().put(path, newFileMetadata);
        storage.store(store());
        return newFileMetadata;
    }

    public void updateMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setLastModified(lastModified);
            metadata.setSummary(summary);
            metadata.setTags(tags);
            metadata.setRelations(relations);
            storage.store(metadata);
        }
    }

    public void updateTags(String path, String tags) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setTags(tags);
            storage.store(metadata);
        }
    }

    public List<FileMetadata> findByTag(String tag) {
        return store().values().stream()
                .filter(m -> m.getTags() != null && m.getTags().contains(tag))
                .toList();
    }

    public void persist(FileMetadata metadata) {
        store().put(metadata.getPath(), metadata);
        storage.store(store());
    }

    public void deleteAll() {
        store().clear();
        storage.store(store());
    }
}
