package dev.rabauer.quanta.backend;

import dev.rabauer.quanta.backend.services.EmbeddingService;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;

@QuarkusTest
class FilesResourceIT {

    @InjectMock
    EmbeddingService embeddingService;

    @Inject
    FileMetadataRepository fileMetadataRepository;

    @BeforeEach
    void setUp() {
        fileMetadataRepository.deleteAll();
    }

    private void persist(FileMetadata... entities) {
        for (FileMetadata e : entities) {
            fileMetadataRepository.persist(e);
        }
    }

    @Test
    void searchFiles_returnsMatchingFiles() {
        persist(
                new FileMetadata("/docs/report.pdf", 0L, "Annual report", "finance", ""),
                new FileMetadata("/docs/notes.txt", 0L, "Meeting notes", "work", "")
        );
        when(embeddingService.getSimilarFiles("report")).thenReturn(List.of("/docs/report.pdf"));

        given()
                .queryParam("prompt", "report")
                .when().get("/searchFiles")
                .then()
                .statusCode(200)
                .body("$.size()", is(1))
                .body("[0].path", is("/docs/report.pdf"))
                .body("[0].summary", is("Annual report"));
    }

    @Test
    void searchFiles_returnsEmpty_whenNoEmbeddingMatches() {
        persist(new FileMetadata("/docs/report.pdf", 0L, "Annual report", "finance", ""));
        when(embeddingService.getSimilarFiles("unrelated")).thenReturn(List.of());

        given()
                .queryParam("prompt", "unrelated")
                .when().get("/searchFiles")
                .then()
                .statusCode(200)
                .body("$.size()", is(0));
    }

    @Test
    void searchFiles_returnsMultipleResults_inEmbeddingOrder() {
        persist(
                new FileMetadata("/a.txt", 0L, "Summary A", "tag-a", ""),
                new FileMetadata("/b.txt", 0L, "Summary B", "tag-b", "")
        );
        when(embeddingService.getSimilarFiles("query")).thenReturn(List.of("/b.txt", "/a.txt"));

        given()
                .queryParam("prompt", "query")
                .when().get("/searchFiles")
                .then()
                .statusCode(200)
                .body("$.size()", is(2))
                .body("[0].path", is("/b.txt"))
                .body("[1].path", is("/a.txt"));
    }

    @Test
    void searchByTag_returnsFilesMatchingTag() {
        persist(
                new FileMetadata("/docs/invoice.pdf", 0L, "Invoice Q1", "finance,billing", ""),
                new FileMetadata("/docs/notes.txt", 0L, "Meeting notes", "work", "")
        );

        given()
                .queryParam("tag", "finance")
                .when().get("/searchByTag")
                .then()
                .statusCode(200)
                .body("$.size()", is(1))
                .body("[0].path", is("/docs/invoice.pdf"))
                .body("[0].summary", is("Invoice Q1"));
    }

    @Test
    void searchByTag_returnsEmpty_whenNoFilesMatchTag() {
        persist(new FileMetadata("/docs/report.pdf", 0L, "Annual report", "finance", ""));

        given()
                .queryParam("tag", "nonexistent")
                .when().get("/searchByTag")
                .then()
                .statusCode(200)
                .body("$.size()", is(0));
    }

    @Test
    void updateTags_persistsNewTags() {
        persist(new FileMetadata("/docs/report.pdf", 0L, "Annual report", "finance", ""));

        given()
                .queryParam("path", "/docs/report.pdf")
                .body("finance,updated")
                .when().post("/updateTags")
                .then()
                .statusCode(204);

        FileMetadata updated = fileMetadataRepository.findById("/docs/report.pdf");
        assert updated != null;
        assert updated.getTags().equals("finance,updated");
    }
}
