package dev.rabauer.quanta.backend.services;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.rabauer.quanta.backend.resources.ChatMessageRequest;
import dev.rabauer.quanta.backend.resources.ChatRequest;
import dev.rabauer.quanta.backend.resources.ChatResponse;
import dev.rabauer.quanta.backend.resources.SourceDto;
import dev.rabauer.quanta.backend.storage.FileMetadata;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;

import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class ChatService {

    @Inject
    ChatModel chatModel;

    @Inject
    EmbeddingService embeddingService;

    @Inject
    FileMetadataRepository fileMetadataRepository;

    public ChatResponse chat(ChatRequest request) {
        List<ChatMessageRequest> messages = request.messages();
        if (messages == null || messages.isEmpty()) {
            throw new BadRequestException("messages must not be empty");
        }

        String userQuery = messages.stream()
                .filter(m -> "user".equals(m.role()))
                .reduce((a, b) -> b)
                .map(ChatMessageRequest::content)
                .orElseThrow(() -> new BadRequestException("at least one user message is required"));

        if (userQuery.isBlank()) {
            throw new BadRequestException("user message content must not be blank");
        }

        List<String> similarPaths = embeddingService.getSimilarFiles(userQuery);
        List<FileMetadata> sources = similarPaths.stream()
                .map(fileMetadataRepository::findByIdOptional)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        String context = sources.stream()
                .map(f -> "File: " + f.getPath() + "\nSummary: " + f.getSummary())
                .collect(Collectors.joining("\n\n"));

        String systemPrompt = """
                You are a helpful assistant that answers questions based on the user's indexed local files.
                Use the file context below to ground your answer. Be concise and factual.
                If the context does not contain enough information to answer, say so honestly.
                Do not make up information that is not in the context.

                """ + (context.isBlank() ? "No relevant files were found." : "Relevant files:\n\n" + context);

        List<dev.langchain4j.data.message.ChatMessage> lcMessages = new ArrayList<>();
        lcMessages.add(SystemMessage.from(systemPrompt));

        for (ChatMessageRequest msg : messages) {
            if ("user".equals(msg.role())) {
                lcMessages.add(UserMessage.from(msg.content()));
            } else if ("assistant".equals(msg.role())) {
                lcMessages.add(AiMessage.from(msg.content()));
            }
        }

        String answer = chatModel.chat(lcMessages).aiMessage().text();

        List<SourceDto> sourceDtos = sources.stream()
                .map(f -> new SourceDto(extractFileName(f.getPath()), f.getPath()))
                .toList();

        return new ChatResponse(answer, sourceDtos);
    }

    private String extractFileName(String path) {
        if (path == null || path.isBlank()) {
            return "";
        }
        try {
            Path filePath = Path.of(path);
            Path fileName = filePath.getFileName();
            return fileName != null ? fileName.toString() : path;
        } catch (InvalidPathException ignored) {
            return path;
        }
    }
}
