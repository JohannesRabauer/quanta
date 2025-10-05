package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.nio.file.Path;

@ApplicationScoped
public class EmbeddingService {

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    PgVectorEmbeddingStore embeddingStore;

    public void embedFileWithContent(Path file, String content) {
        if (content == null || content.isBlank()) {
            return;
        }
        Embedding embedding = embeddingModel.embed(content).content();
        embeddingStore.add(content, embedding);
    }
}