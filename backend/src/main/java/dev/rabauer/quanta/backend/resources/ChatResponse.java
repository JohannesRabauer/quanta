package dev.rabauer.quanta.backend.resources;

import java.util.List;

public record ChatResponse(String answer, List<SourceDto> sources) {
}
