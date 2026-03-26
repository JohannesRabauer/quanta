package dev.rabauer.quanta.backend.services;

import dev.langchain4j.community.store.embedding.neo4j.Neo4jEmbeddingStore;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.rabauer.quanta.backend.storage.Chunk;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.neo4j.driver.internal.InternalFloat32Vector;
import org.neo4j.ogm.session.Session;

import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

@ApplicationScoped
public class EmbeddingService {

    @Inject
    EmbeddingModel embeddingModel;

    @Inject
    Session session;

    @Inject
    Neo4jEmbeddingStore embeddingStore;

    public void embedFileWithContent(FileMetadata fileMetadata, Path file, String content, String summary) {

        if (content == null || content.isBlank()) {
            return;
        }
        DocumentSplitter splitter = DocumentSplitters.recursive(500, 100);
        List<TextSegment> textSegments = splitter.split(Document.document(content));
        List<Chunk> chunks = textSegments
                .stream()
                .map(
                        textSegment ->
                        {
                            Embedding embedding = embeddingModel.embed(textSegment).content();
                            Chunk newChunk = new Chunk(
                                    textSegment.text(),
                                    new InternalFloat32Vector(embedding.vector()),
                                    fileMetadata
                            );
                            session.save(newChunk);
                            return newChunk;
                        }
                ).toList();

//        KnowledgeGraphWriter writer = KnowledgeGraphWriter.builder()
//                .graph(neo4jGraph)
//                .label("Entity")
//                .relType("MENTIONS")
//                .idProperty("id")
//                .textProperty("text")
//                .build();
//
//        List<GraphDocument> graphDocuments = GraphDocument.from(
//                chunks.stream().map(chunk -> GraphNode.from(chunk.getId().toString())).collect(Collectors.toSet()),
//                GraphEdge.from(GraphNode));
//        writer.addGraphDocuments(graphDocuments, true); // set to true to include document sourc

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
                .toList()
                .reversed();
    }
}