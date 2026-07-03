package dev.rabauer.quanta.backend;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.rabauer.quanta.backend.services.EmbeddingService;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.InjectMock;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
@QuarkusTestResource(PostgresTestResource.class)
class ChatResourceIT {

    @InjectMock
    ChatModel chatModel;

    @InjectMock
    EmbeddingService embeddingService;

    @Inject
    FileMetadataRepository fileMetadataRepository;

    @BeforeEach
    void setUp() {
        QuarkusTransaction.requiringNew().run(() -> fileMetadataRepository.deleteAll());
    }

    @Test
    void chat_returnsGroundedAnswerWithCitations() {
        persist(
                new FileMetadata("/docs/report.pdf", 0L, "Q3 revenue increased", "finance", ""),
                new FileMetadata("/docs/notes/follow-up.md", 0L, "Hiring continued", "ops", "")
        );
        when(embeddingService.getSimilarFiles("What does the report say about Q3?"))
                .thenReturn(List.of("/docs/report.pdf", "/docs/notes/follow-up.md"));
        when(chatModel.chat(anyList())).thenReturn(chatResponse("Q3 revenue increased and hiring continued."));

        given()
                .contentType("application/json")
                .body("""
                        {
                          "messages": [
                            { "role": "user", "content": "What does the report say about Q3?" }
                          ]
                        }
                        """)
                .when().post("/chat")
                .then()
                .statusCode(200)
                .body("answer", is("Q3 revenue increased and hiring continued."))
                .body("sources.name", contains("report.pdf", "follow-up.md"))
                .body("sources.path", contains("/docs/report.pdf", "/docs/notes/follow-up.md"));

        List<ChatMessage> modelMessages = captureModelMessages();
        assertEquals(2, modelMessages.size());

        SystemMessage systemMessage = assertInstanceOf(SystemMessage.class, modelMessages.getFirst());
        UserMessage userMessage = assertInstanceOf(UserMessage.class, modelMessages.get(1));

        assertTrue(systemMessage.text().contains("File: /docs/report.pdf"));
        assertTrue(systemMessage.text().contains("Summary: Q3 revenue increased"));
        assertTrue(systemMessage.text().contains("File: /docs/notes/follow-up.md"));
        assertTrue(systemMessage.text().contains("Summary: Hiring continued"));
        assertEquals("What does the report say about Q3?", userMessage.singleText());
    }

    @Test
    void chat_forwardsConversationHistoryForFollowUpQuestions() {
        persist(new FileMetadata("/docs/report.pdf", 0L, "Q3 revenue increased", "finance", ""));
        when(embeddingService.getSimilarFiles("Can you elaborate on that?"))
                .thenReturn(List.of("/docs/report.pdf"));
        when(chatModel.chat(anyList())).thenReturn(chatResponse("Revenue grew because enterprise renewals accelerated."));

        given()
                .contentType("application/json")
                .body("""
                        {
                          "messages": [
                            { "role": "user", "content": "Summarize the Q3 report." },
                            { "role": "assistant", "content": "Q3 revenue increased." },
                            { "role": "user", "content": "Can you elaborate on that?" }
                          ]
                        }
                        """)
                .when().post("/chat")
                .then()
                .statusCode(200)
                .body("answer", is("Revenue grew because enterprise renewals accelerated."))
                .body("sources.name", contains("report.pdf"))
                .body("sources.path", contains("/docs/report.pdf"));

        verify(embeddingService).getSimilarFiles("Can you elaborate on that?");

        List<ChatMessage> modelMessages = captureModelMessages();
        assertEquals(4, modelMessages.size());

        assertInstanceOf(SystemMessage.class, modelMessages.get(0));
        assertEquals("Summarize the Q3 report.", assertInstanceOf(UserMessage.class, modelMessages.get(1)).singleText());
        assertEquals("Q3 revenue increased.", assertInstanceOf(AiMessage.class, modelMessages.get(2)).text());
        assertEquals("Can you elaborate on that?", assertInstanceOf(UserMessage.class, modelMessages.get(3)).singleText());
    }

    @Test
    void chat_returnsBadRequestWhenConversationIsEmpty() {
        given()
                .contentType("application/json")
                .body("""
                        {
                          "messages": []
                        }
                        """)
                .when().post("/chat")
                .then()
                .statusCode(400);
    }

    private void persist(FileMetadata... entities) {
        QuarkusTransaction.requiringNew().run(() -> {
            for (FileMetadata entity : entities) {
                fileMetadataRepository.persist(entity);
            }
        });
    }

    private ChatResponse chatResponse(String answer) {
        return ChatResponse.builder()
                .aiMessage(AiMessage.from(answer))
                .build();
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private List<ChatMessage> captureModelMessages() {
        ArgumentCaptor<List> captor = ArgumentCaptor.forClass(List.class);
        verify(chatModel).chat(captor.capture());
        return captor.getValue();
    }
}
