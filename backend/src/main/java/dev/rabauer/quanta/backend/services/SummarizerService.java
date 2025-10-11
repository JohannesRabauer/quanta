package dev.rabauer.quanta.backend.services;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService
public interface SummarizerService {

    @SystemMessage(
            """
                    You are a helpful assistant that summarizes the content of a document in about 300 characters. 
                    Don't return anything else but the summary.
                    """)
    String summarize(@UserMessage String content);
}