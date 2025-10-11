package dev.rabauer.quanta.backend.storage;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FileMetadataRepository implements PanacheRepositoryBase<FileMetadata, String> {

    public Long findLastModifiedByPath(String path) {
        FileMetadata metadata = findById(path);
        return metadata != null ? metadata.getLastModified() : null;
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary) {
        FileMetadata newFileMetadata = new FileMetadata(path, lastModified, summary);
        persist(newFileMetadata);
        return newFileMetadata;
    }

    public void updateMetadata(String path, Long lastModified, String summary) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setLastModified(lastModified);
            metadata.setSummary(summary);
            persist(metadata); // Panache persist merges if entity already managed
        }
    }
}
