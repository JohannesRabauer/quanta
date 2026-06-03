package dev.rabauer.quanta.backend.storage;

import java.util.HashMap;
import java.util.Map;

public class StorageRoot {

    private final Map<String, FileMetadata> fileMetadataByPath = new HashMap<>();

    public Map<String, FileMetadata> getFileMetadataByPath() {
        return fileMetadataByPath;
    }
}
