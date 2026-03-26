package dev.rabauer.quanta.backend.storage;

import org.neo4j.driver.types.Vector;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;
import org.neo4j.ogm.id.UuidStrategy;

import java.util.UUID;

@NodeEntity
public class Chunk implements java.io.Serializable {
    private final String text;
    private final Vector vector;
    @Relationship(type = "HAS_FILE_METADATA", direction = Relationship.Direction.OUTGOING)
    private final FileMetadata fileMetadata;
    @Id
    @GeneratedValue(strategy = UuidStrategy.class)
    private UUID id;

    public Chunk(String text, Vector vector, FileMetadata fileMetadata) {
        this.text = text;
        this.vector = vector;
        this.fileMetadata = fileMetadata;
    }

    public String getText() {
        return text;
    }

    public Vector getVector() {
        return vector;
    }

    public FileMetadata getFileMetadata() {
        return fileMetadata;
    }

    public UUID getId() {
        return id;
    }
}
