package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

import static dev.rabauer.quanta.backend.storage.FileMetadata.toAbsoluteFileString;

@ApplicationScoped
public class EmbeddingService {

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    PgVectorEmbeddingStore embeddingStore;

    public void embedFileWithContent(String uuid, Path file, String content) {
        if (content == null || content.isBlank()) {
            return;
        }
        Embedding embedding = embeddingModel.embed(content).content();
        embeddingStore.addAll(
                List.of(uuid),
                List.of(embedding),
                List.of(TextSegment.textSegment(toAbsoluteFileString(file)))
        );
    }

    public List<String> getSimilarFiles(String prompt) {
        Embedding embedding = embeddingModel.embed(prompt).content();
        EmbeddingSearchResult<TextSegment> result = embeddingStore.search(
                EmbeddingSearchRequest
                        .builder()
                        .queryEmbedding(embedding)
                        .maxResults(10)
                        .build()
        );
        return result
                .matches()
                .stream()
                .sorted(Comparator.comparingDouble(EmbeddingMatch::score))
                .map(EmbeddingMatch::embedded)
                .map(TextSegment::text)
                .toList().reversed();
    }
}