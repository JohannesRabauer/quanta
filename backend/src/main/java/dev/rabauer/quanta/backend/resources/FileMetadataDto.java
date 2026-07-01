package dev.rabauer.quanta.backend.resources;

public record FileMetadataDto(
        String name,
        String path,
        Long lastModified,
        String summary,
        String tags,
        String relations
) {
}
