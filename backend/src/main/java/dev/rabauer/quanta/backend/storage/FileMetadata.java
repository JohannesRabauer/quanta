package dev.rabauer.quanta.backend.storage;

import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.nio.file.Path;
import java.util.List;

@NodeEntity
public class FileMetadata implements java.io.Serializable {

    @Id
    private String path;

    private Long lastModified;

    private String summary;

    @Relationship(type = "HAS_TAG", direction = Relationship.Direction.OUTGOING)
    private List<Tag> tags;

    private String relations;

    public FileMetadata() {
    }

    public FileMetadata(String path, Long lastModified, String summary, String relations) {
        this.path = path;
        this.lastModified = lastModified;
        this.summary = summary;
        this.relations = relations;
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

    public String getRelations() {
        return relations;
    }

    public void setRelations(String relations) {
        this.relations = relations;
    }
}
