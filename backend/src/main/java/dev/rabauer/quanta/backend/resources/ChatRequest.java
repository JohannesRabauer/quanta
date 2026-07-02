package dev.rabauer.quanta.backend.resources;

import java.util.List;

public record ChatRequest(List<ChatMessageRequest> messages) {
}
