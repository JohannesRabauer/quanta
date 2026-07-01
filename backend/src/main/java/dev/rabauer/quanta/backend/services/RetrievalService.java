package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.resources.FileMetadataDto;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class RetrievalService {
    @Inject
    FileMetadataRepository fileMetadataRepository;
    @Inject
    EmbeddingService embeddingService;

    public List<FileMetadataDto> findFiles(String prompt) {
        List<String> list = embeddingService
                .getSimilarFiles(prompt)
                .stream()
                .toList();
        List<FileMetadata> list1 = list
                .stream()
                .map(fileMetadataRepository::findByIdOptional)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        return list1.stream()
                .map(this::entityToDto)
                .toList();
    }

    public List<FileMetadataDto> findFilesByTag(String tag) {
        return fileMetadataRepository.findByTag(tag).stream()
                .map(this::entityToDto)
                .toList();
    }

    private FileMetadataDto entityToDto(FileMetadata fileMetadata) {
        String path = fileMetadata.getPath();
        return new FileMetadataDto(
                extractFileName(path),
                path,
                fileMetadata.getLastModified(),
                fileMetadata.getSummary(),
                fileMetadata.getTags(),
                fileMetadata.getRelations()
        );
    }

    private String extractFileName(String path) {
        if (path == null || path.isBlank()) {
            return "";
        }

        try {
            Path filePath = Path.of(path);
            Path fileName = filePath.getFileName();
            return fileName != null ? fileName.toString() : path;
        } catch (InvalidPathException ignored) {
            return path;
        }
    }
}
