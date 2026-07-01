package dev.rabauer.quanta.backend.storage;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

@ApplicationScoped
public class FileMetadataRepository implements PanacheRepositoryBase<FileMetadata, String> {

    public Long findLastModifiedByPath(String path) {
        FileMetadata metadata = findById(path);
        return metadata != null ? metadata.getLastModified() : null;
    }

    public FileMetadata saveMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata newFileMetadata = new FileMetadata(
                path,
                lastModified,
                normalizeText(summary),
                normalizeCommaSeparatedList(tags),
                normalizeCommaSeparatedList(relations)
        );
        persist(newFileMetadata);
        return newFileMetadata;
    }

    public void updateMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        FileMetadata metadata = findById(path);
        if (metadata != null) {
            metadata.setLastModified(lastModified);
            metadata.setSummary(normalizeText(summary));
            metadata.setTags(normalizeCommaSeparatedList(tags));
            metadata.setRelations(normalizeCommaSeparatedList(relations));
        }
    }

    public boolean updateTags(String path, String tags) {
        FileMetadata metadata = findById(path);
        if (metadata == null) {
            return false;
        }

        metadata.setTags(normalizeCommaSeparatedList(tags));
        return true;
    }

    public List<FileMetadata> findByTag(String tag) {
        String normalizedTag = normalizeText(tag);
        if (normalizedTag == null) {
            return List.of();
        }

        String candidateMatch = "%" + normalizedTag.toLowerCase(Locale.ROOT) + "%";
        return list("lower(tags) like ?1", candidateMatch).stream()
                .filter(metadata -> parseCommaSeparatedList(metadata.getTags()).stream()
                        .anyMatch(existingTag -> existingTag.equalsIgnoreCase(normalizedTag)))
                .toList();
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String normalizeCommaSeparatedList(String value) {
        List<String> items = parseCommaSeparatedList(value);
        if (items.isEmpty()) {
            return null;
        }

        return String.join(", ", new LinkedHashSet<>(items));
    }

    private List<String> parseCommaSeparatedList(String value) {
        String normalized = normalizeText(value);
        if (normalized == null) {
            return List.of();
        }

        return List.of(normalized.split(",")).stream()
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .toList();
    }
}
