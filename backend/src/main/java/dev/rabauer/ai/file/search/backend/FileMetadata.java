package dev.rabauer.ai.file.search.backend;

public record FileMetadata(
        String name,
        String path,
        String hash,
        String summary
) {
}
