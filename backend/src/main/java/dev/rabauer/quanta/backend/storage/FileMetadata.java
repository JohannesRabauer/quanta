package dev.rabauer.quanta.backend.storage;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.nio.file.Path;
import java.util.UUID;

@Entity
@Table(name = "file_metadata")
public class FileMetadata extends PanacheEntityBase {

    @Id
    @Column(name = "path", nullable = false, unique = true, length = 1024)
    private String path;

    @Column(name = "last_modified", nullable = false)
    private Long lastModified;

    @Column(name = "vector_uuid")
    private String vectorUUID;

    @Column(name = "summary", length = 2000)
    private String summary;

    public FileMetadata() {
    }

    public FileMetadata(String path, Long lastModified, String summary) {
        this.path = path;
        this.lastModified = lastModified;
        this.summary = summary;
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
}
