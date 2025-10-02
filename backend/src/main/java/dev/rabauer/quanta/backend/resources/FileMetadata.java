package dev.rabauer.quanta.backend.resources;

public record FileMetadata(
        String name,
        String path,
        String hash,
        String summary
) {
}
