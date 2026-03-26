package dev.rabauer.quanta.backend.storage;

import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;

import java.util.UUID;

@NodeEntity
public class Tag implements java.io.Serializable {
    @Id
    private UUID id;
    private String name;


}
