package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmbeddingServiceTest {

    private EmbeddingModel embeddingModel;
    private InMemoryEmbeddingStore<TextSegment> embeddingStore;
    private EmbeddingService embeddingService;

    @BeforeEach
    void setUp() throws Exception {
        embeddingModel = mock(EmbeddingModel.class);
        embeddingStore = mock(InMemoryEmbeddingStore.class);

        embeddingService = new EmbeddingService();
        setField(embeddingService, "embeddingModel", embeddingModel);
        setField(embeddingService, "embeddingStore", embeddingStore);
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        var field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private Embedding dummyEmbedding() {
        return Embedding.from(new float[]{0.1f, 0.2f, 0.3f});
    }

    private EmbeddingMatch<TextSegment> matchWithScore(String path, double score) {
        return new EmbeddingMatch<>(score, "id-" + path, dummyEmbedding(), TextSegment.from(path));
    }

    @Test
    void getSimilarFiles_returnsUniquePathsInDescendingScoreOrder() {
        Embedding queryEmbedding = dummyEmbedding();
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(queryEmbedding));

        List<EmbeddingMatch<TextSegment>> matches = List.of(
                matchWithScore("/file/a.txt", 0.7),
                matchWithScore("/file/b.txt", 0.9),
                matchWithScore("/file/a.txt", 0.6)  // duplicate of a.txt with lower score
        );
        when(embeddingStore.search(any(EmbeddingSearchRequest.class)))
                .thenReturn(new EmbeddingSearchResult<>(matches));

        List<String> result = embeddingService.getSimilarFiles("some query");

        assertEquals(List.of("/file/b.txt", "/file/a.txt"), result);
    }

    @Test
    void getSimilarFiles_returnsEmptyList_whenNoMatches() {
        Embedding queryEmbedding = dummyEmbedding();
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(queryEmbedding));
        when(embeddingStore.search(any(EmbeddingSearchRequest.class)))
                .thenReturn(new EmbeddingSearchResult<>(List.of()));

        List<String> result = embeddingService.getSimilarFiles("nothing");

        assertEquals(List.of(), result);
    }

    @Test
    void getSimilarFiles_returnsSingleResult_whenNoDuplicates() {
        Embedding queryEmbedding = dummyEmbedding();
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(queryEmbedding));

        List<EmbeddingMatch<TextSegment>> matches = List.of(
                matchWithScore("/file/c.txt", 0.8)
        );
        when(embeddingStore.search(any(EmbeddingSearchRequest.class)))
                .thenReturn(new EmbeddingSearchResult<>(matches));

        List<String> result = embeddingService.getSimilarFiles("query");

        assertEquals(List.of("/file/c.txt"), result);
    }
}
