package dev.rabauer.quanta.backend.resources;

public record FileMetadataDto(
        String name,
        String path,
        String hash,
        String summary
) {
}
