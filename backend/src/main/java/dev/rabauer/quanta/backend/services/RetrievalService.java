package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.resources.FileMetadataDto;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class RetrievalService {
    @Inject
    FileMetadataRepository fileMetadataRepository;
    @Inject
    EmbeddingService embeddingService;

    public List<FileMetadataDto> findFiles(String prompt) {
        List<String> similarFiles = embeddingService.getSimilarFiles(prompt);
        return fileMetadataRepository
                .list("path in ?1", similarFiles)
                .stream()
                .map(this::entityToDto)
                .toList();
    }

    private FileMetadataDto entityToDto(FileMetadata fileMetadata) {
        return new FileMetadataDto(
                fileMetadata.getPath(),
                fileMetadata.getPath(),
                "",
                fileMetadata.getSummary()
        );
    }
}
