package dev.rabauer.quanta.backend.services;

import dev.rabauer.quanta.backend.resources.FileMetadataDto;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class RetrievalServiceTest {

    private FileMetadataRepository fileMetadataRepository;
    private EmbeddingService embeddingService;
    private RetrievalService retrievalService;

    @BeforeEach
    void setUp() throws Exception {
        fileMetadataRepository = mock(FileMetadataRepository.class);
        embeddingService = mock(EmbeddingService.class);

        retrievalService = new RetrievalService();
        setField(retrievalService, "fileMetadataRepository", fileMetadataRepository);
        setField(retrievalService, "embeddingService", embeddingService);
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        var field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private FileMetadata fileMetadata(String path, String summary, String tags, String relations) {
        return new FileMetadata(path, 0L, summary, tags, relations);
    }

    @Test
    void findFiles_returnsMappedDtos_forMatchingPaths() {
        FileMetadata meta = fileMetadata("/docs/report.pdf", "A report", "finance", "none");
        when(embeddingService.getSimilarFiles("report")).thenReturn(List.of("/docs/report.pdf"));
        when(fileMetadataRepository.findByIdOptional("/docs/report.pdf")).thenReturn(Optional.of(meta));

        List<FileMetadataDto> result = retrievalService.findFiles("report");

        assertEquals(1, result.size());
        FileMetadataDto dto = result.get(0);
        assertEquals("/docs/report.pdf", dto.path());
        assertEquals("A report", dto.summary());
        assertEquals("finance", dto.tags());
    }

    @Test
    void findFiles_skipsPathsNotFoundInRepository() {
        when(embeddingService.getSimilarFiles("missing")).thenReturn(List.of("/docs/ghost.pdf"));
        when(fileMetadataRepository.findByIdOptional("/docs/ghost.pdf")).thenReturn(Optional.empty());

        List<FileMetadataDto> result = retrievalService.findFiles("missing");

        assertTrue(result.isEmpty());
    }

    @Test
    void findFiles_returnsMultipleDtos_inEmbeddingOrder() {
        FileMetadata metaA = fileMetadata("/a.txt", "Summary A", "tag-a", "");
        FileMetadata metaB = fileMetadata("/b.txt", "Summary B", "tag-b", "");
        when(embeddingService.getSimilarFiles("query")).thenReturn(List.of("/a.txt", "/b.txt"));
        when(fileMetadataRepository.findByIdOptional("/a.txt")).thenReturn(Optional.of(metaA));
        when(fileMetadataRepository.findByIdOptional("/b.txt")).thenReturn(Optional.of(metaB));

        List<FileMetadataDto> result = retrievalService.findFiles("query");

        assertEquals(2, result.size());
        assertEquals("/a.txt", result.get(0).path());
        assertEquals("/b.txt", result.get(1).path());
    }

    @Test
    void findFilesByTag_returnsDtosMatchingTag() {
        FileMetadata meta = fileMetadata("/notes/todo.txt", "Todo list", "personal", "");
        when(fileMetadataRepository.findByTag("personal")).thenReturn(List.of(meta));

        List<FileMetadataDto> result = retrievalService.findFilesByTag("personal");

        assertEquals(1, result.size());
        assertEquals("/notes/todo.txt", result.get(0).path());
        assertEquals("personal", result.get(0).tags());
    }

    @Test
    void findFilesByTag_returnsEmpty_whenNoFilesMatchTag() {
        when(fileMetadataRepository.findByTag("nonexistent")).thenReturn(List.of());

        List<FileMetadataDto> result = retrievalService.findFilesByTag("nonexistent");

        assertTrue(result.isEmpty());
    }
}
