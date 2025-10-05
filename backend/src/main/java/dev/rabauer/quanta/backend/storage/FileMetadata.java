package dev.rabauer.quanta.backend.storage;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_metadata")
public class FileMetadata extends PanacheEntityBase {

    @Id
    @Column(name = "path", nullable = false, unique = true, length = 1024)
    private String path;

    @Column(name = "last_modified", nullable = false)
    private Long lastModified;

    public FileMetadata() {}

    public FileMetadata(String path, Long lastModified) {
        this.path = path;
        this.lastModified = lastModified;
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
}
