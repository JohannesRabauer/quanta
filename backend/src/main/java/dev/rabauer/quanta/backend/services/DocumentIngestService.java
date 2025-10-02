package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import io.quarkiverse.langchain4j.pgvector.PgVectorEmbeddingStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.tika.Tika;

import java.nio.file.Path;

@ApplicationScoped
public class DocumentIngestService {

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    PgVectorEmbeddingStore embeddingStore;

    private final Tika tika = new Tika();

    public void ingestFile(Path file) throws Exception {
        String content = tika.parseToString(file.toFile());
        Embedding embedding = embeddingModel.embed(content).content();

        embeddingStore.add(content, embedding);
    }
}