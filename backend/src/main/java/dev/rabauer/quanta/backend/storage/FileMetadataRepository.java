package dev.rabauer.quanta.backend.storage;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class FileMetadataRepository implements PanacheRepositoryBase<FileMetadata, String> {

    public Long findLastModifiedByPath(String path) {
        FileMetadata metadata = findById(path);
        return metadata != null ? metadata.getLastModified() : null;
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata newFileMetadata = new FileMetadata(path, lastModified, summary, tags, relations);
        persist(newFileMetadata);
        return newFileMetadata;
    }

    public void updateMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setLastModified(lastModified);
            metadata.setSummary(summary);
            metadata.setTags(tags);
            metadata.setRelations(relations);
        }
    }

    public void updateTags(String path, String tags) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setTags(tags);
        }
    }

    public List<FileMetadata> findByTag(String tag) {
        return list("tags like ?1", "%" + tag + "%");
    }
}
