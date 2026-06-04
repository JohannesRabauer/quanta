package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.rabauer.quanta.backend.storage.EmbeddingEntry;
import org.eclipse.store.gigamap.jvector.VectorIndex;
import org.eclipse.store.gigamap.jvector.VectorSearchResult;
import org.eclipse.store.gigamap.types.EntityIdMatcher;
import org.eclipse.store.gigamap.types.GigaMap;
import org.eclipse.store.gigamap.types.ScoredSearchResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class EmbeddingServiceTest {

    private EmbeddingModel embeddingModel;
    private VectorIndex<EmbeddingEntry> vectorIndex;
    private EmbeddingService embeddingService;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() throws Exception {
        embeddingModel = mock(EmbeddingModel.class);
        vectorIndex = mock(VectorIndex.class);

        embeddingService = new EmbeddingService();
        setField(embeddingService, "embeddingModel", embeddingModel);
        setField(embeddingService, "vectorIndex", vectorIndex);
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        var field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private float[] dummyVector() {
        return new float[]{0.1f, 0.2f, 0.3f};
    }

    private Embedding dummyEmbedding() {
        return Embedding.from(dummyVector());
    }

    private ScoredSearchResult.Entry<EmbeddingEntry> entryFor(EmbeddingEntry e) {
        return new ScoredSearchResult.Entry<>() {
            @Override public long entityId() { return 0; }
            @Override public float score()    { return 1.0f; }
            @Override public EmbeddingEntry entity() { return e; }
        };
    }

    @SafeVarargs
    private VectorSearchResult<EmbeddingEntry> searchResultOf(ScoredSearchResult.Entry<EmbeddingEntry>... entries) {
        List<ScoredSearchResult.Entry<EmbeddingEntry>> list = Arrays.asList(entries);
        return new VectorSearchResult<>() {
            @Override public int size()    { return list.size(); }
            @Override public boolean isEmpty() { return list.isEmpty(); }
            @Override public Iterator<ScoredSearchResult.Entry<EmbeddingEntry>> iterator() { return list.iterator(); }
            @Override public Stream<ScoredSearchResult.Entry<EmbeddingEntry>> stream()    { return list.stream(); }
            @Override public <P extends Consumer<? super ScoredSearchResult.Entry<EmbeddingEntry>>> P iterate(P p) {
                list.forEach(p); return p;
            }
            @Override public ScoredSearchResult<EmbeddingEntry> and(GigaMap.SubQuery q) {
                throw new UnsupportedOperationException();
            }
            @Override public EntityIdMatcher provideEntityIdMatcher() {
                throw new UnsupportedOperationException();
            }
        };
    }

    @Test
    void getSimilarFiles_returnsPathsFromVectorSearch() {
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(dummyEmbedding()));

        var entryA = entryFor(new EmbeddingEntry("uuid-a", "/file/a.txt", dummyVector()));
        var entryB = entryFor(new EmbeddingEntry("uuid-b", "/file/b.txt", dummyVector()));
        when(vectorIndex.search(any(float[].class), anyInt())).thenReturn(searchResultOf(entryA, entryB));

        List<String> result = embeddingService.getSimilarFiles("some query");

        assertEquals(List.of("/file/a.txt", "/file/b.txt"), result);
    }

    @Test
    void getSimilarFiles_returnsEmptyList_whenNoMatches() {
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(dummyEmbedding()));
        when(vectorIndex.search(any(float[].class), anyInt())).thenReturn(searchResultOf());

        List<String> result = embeddingService.getSimilarFiles("nothing");

        assertTrue(result.isEmpty());
    }

    @Test
    void getSimilarFiles_deduplicatesPaths() {
        when(embeddingModel.embed(any(String.class))).thenReturn(Response.from(dummyEmbedding()));

        var entryA1 = entryFor(new EmbeddingEntry("uuid-a1", "/file/a.txt", dummyVector()));
        var entryA2 = entryFor(new EmbeddingEntry("uuid-a2", "/file/a.txt", dummyVector()));
        var entryB  = entryFor(new EmbeddingEntry("uuid-b",  "/file/b.txt", dummyVector()));
        when(vectorIndex.search(any(float[].class), anyInt())).thenReturn(searchResultOf(entryA1, entryA2, entryB));

        List<String> result = embeddingService.getSimilarFiles("query");

        assertEquals(List.of("/file/a.txt", "/file/b.txt"), result);
    }
}
