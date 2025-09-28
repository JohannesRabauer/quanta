package dev.rabauer.quanta.backend;

public record FileMetadata(
        String name,
        String path,
        String hash,
        String summary
) {
}
