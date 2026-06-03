package dev.rabauer.quanta.backend.storage;

import java.nio.file.Path;
import java.util.UUID;

public class FileMetadata {

    private String path;
    private Long lastModified;
    private String vectorUUID;
    private String summary;
    private String tags;
    private String relations;

    public FileMetadata() {
    }

    public FileMetadata(String path, Long lastModified, String summary, String tags, String relations) {
        this.path = path;
        this.lastModified = lastModified;
        this.summary = summary;
        this.tags = tags;
        this.relations = relations;
        this.vectorUUID = UUID.randomUUID().toString();
    }

    public static String toAbsoluteFileString(Path filePath) {
        return filePath.toAbsolutePath().toString();
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getLastModified() {
        return lastModified;
    }

    public void setLastModified(Long lastModified) {
        this.lastModified = lastModified;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getVectorUUID() {
        return vectorUUID;
    }

    public void setVectorUUID(String vectorUUID) {
        this.vectorUUID = vectorUUID;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getRelations() {
        return relations;
    }

    public void setRelations(String relations) {
        this.relations = relations;
    }
}
