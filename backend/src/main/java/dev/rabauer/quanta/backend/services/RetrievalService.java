package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.resources.FileMetadataDto;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class RetrievalService {
    @Inject
    EmbeddingService embeddingService;

    public List<FileMetadataDto> findFiles(String prompt) {
        List<String> list = embeddingService
                .getSimilarFiles(prompt)
                .stream()
                .toList();
//        List<FileMetadata> list1 = list
//                .stream()
//                .map(fileContent -> Optional.of(fileContent))
//                .filter(Optional::isPresent)
//                .map(Optional::get)
//                .toList();
        return list.stream()
                .map(fileContent -> new FileMetadataDto("1", "1", "1", fileContent, "1", "1"))
                .toList();
    }

    public List<FileMetadataDto> findFilesByTag(String tag) {
        return List.of();
//        return fileMetadataRepository.findByTag(tag).stream()
//                .map(this::entityToDto)
//                .toList();
    }

    private FileMetadataDto entityToDto(FileMetadata fileMetadata) {
        return new FileMetadataDto(
                fileMetadata.getPath(),
                fileMetadata.getPath(),
                "",
                fileMetadata.getSummary(),
                "",
                fileMetadata.getRelations()
        );
    }
}
