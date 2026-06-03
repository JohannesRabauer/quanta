package dev.rabauer.quanta.backend.storage;

import java.util.HashMap;
import java.util.Map;

public class FileMetadataStore {

    private final Map<String, FileMetadata> entries = new HashMap<>();

    public Map<String, FileMetadata> getEntries() {
        return entries;
    }
}
