package dev.rabauer.quanta.backend.services;

import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.rabauer.quanta.backend.storage.EmbeddingEntry;
import dev.rabauer.quanta.backend.storage.StorageRoot;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.store.gigamap.jvector.VectorIndex;
import org.eclipse.store.gigamap.jvector.VectorIndexConfiguration;
import org.eclipse.store.gigamap.jvector.VectorIndices;
import org.eclipse.store.gigamap.jvector.Vectorizer;
import org.eclipse.store.gigamap.types.GigaMap;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.SequencedSet;

import static dev.rabauer.quanta.backend.storage.FileMetadata.toAbsoluteFileString;

@ApplicationScoped
public class EmbeddingService {

    private static final String INDEX_NAME = "file-embeddings";

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    StorageRoot root;

    private VectorIndex<EmbeddingEntry> vectorIndex;

    @PostConstruct
    void init() {
        GigaMap<EmbeddingEntry> embeddings = root.getEmbeddings();

        // Restart-safe: get existing category or register a new one
        VectorIndices<EmbeddingEntry> indices = embeddings.index().get(VectorIndices.class);
        if (indices == null) {
            indices = embeddings.index().register(VectorIndices.Category());
        }

        int dimension = embeddingModel.dimension();
        VectorIndexConfiguration cfg = VectorIndexConfiguration.forSmallDataset(dimension);

        vectorIndex = indices.ensure(INDEX_NAME, cfg, new Vectorizer<>() {
            @Override
            public float[] vectorize(EmbeddingEntry entry) {
                return entry.getVector();
            }
        });
    }

    public void embedFileWithContent(String uuid, Path file, String content, String summary) {
        if (content == null || content.isBlank()) {
            return;
        }
        String absoluteFilePath = toAbsoluteFileString(file);
        float[] vector = embeddingModel.embed(content).content().vector();

        GigaMap<EmbeddingEntry> embeddings = root.getEmbeddings();

        // Replace existing entry for this uuid if present
        embeddings.query(StorageRoot.EMBEDDING_UUID_INDEX.is(uuid))
                .toList()
                .forEach(embeddings::remove);

        embeddings.add(new EmbeddingEntry(uuid, absoluteFilePath, vector));
        embeddings.store();
    }

    public List<String> getSimilarFiles(String prompt) {
        float[] queryVector = embeddingModel.embed(prompt).content().vector();

        SequencedSet<String> seen = new LinkedHashSet<>();
        vectorIndex.search(queryVector, 10)
                .stream()
                .map(result -> result.entity().getFilePath())
                .forEach(seen::add);

        return new ArrayList<>(seen);
    }
}
