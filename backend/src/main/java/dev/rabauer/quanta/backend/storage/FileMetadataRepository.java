package dev.rabauer.quanta.backend.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.store.gigamap.types.GigaMap;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class FileMetadataRepository {

    @Inject
    StorageRoot root;

    private GigaMap<FileMetadata> map() {
        return root.getFileMetadata();
    }

    public FileMetadata findById(String path) {
        return map().query(StorageRoot.FILE_PATH_INDEX.is(path)).toList().stream().findFirst().orElse(null);
    }

    public Optional<FileMetadata> findByIdOptional(String path) {
        return Optional.ofNullable(findById(path));
    }

    public Long findLastModifiedByPath(String path) {
        FileMetadata metadata = findById(path);
        return metadata != null ? metadata.getLastModified() : null;
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata existing = findById(path);
        if (existing != null) {
            map().update(existing, m -> {
                m.setLastModified(lastModified);
                m.setSummary(summary);
                m.setTags(tags);
                m.setRelations(relations);
            });
            map().store();
            return findById(path);
        }
        FileMetadata newEntry = new FileMetadata(path, lastModified, summary, tags, relations);
        map().add(newEntry);
        map().store();
        return newEntry;
    }

    public void updateMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            map().update(metadata, m -> {
                m.setLastModified(lastModified);
                m.setSummary(summary);
                m.setTags(tags);
                m.setRelations(relations);
            });
            map().store();
        }
    }

    public void updateTags(String path, String tags) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            map().update(metadata, m -> m.setTags(tags));
            map().store();
        }
    }

    public List<FileMetadata> findByTag(String tag) {
        return map().query(StorageRoot.FILE_PATH_INDEX.is(e -> e != null))
                .toList()
                .stream()
                .filter(m -> m.getTags() != null && m.getTags().contains(tag))
                .toList();
    }

    public void persist(FileMetadata metadata) {
        FileMetadata existing = findById(metadata.getPath());
        if (existing != null) {
            map().update(existing, m -> {
                m.setLastModified(metadata.getLastModified());
                m.setSummary(metadata.getSummary());
                m.setTags(metadata.getTags());
                m.setRelations(metadata.getRelations());
            });
        } else {
            map().add(metadata);
        }
        map().store();
    }

    public void deleteAll() {
        map().query(StorageRoot.FILE_PATH_INDEX.is(e -> e != null)).toList().forEach(map()::remove);
        map().store();
    }
}
