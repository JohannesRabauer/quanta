package dev.rabauer.quanta.backend.services;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService
public interface TagAndRelationService {

    @SystemMessage(
            """
                    You are a helpful assistant that analyzes the content of a document and extracts up to 10 relevant tags and 3-5 relations to potential other topics or documents.
                    Return the tags as a comma-separated list and the relations as a comma-separated list.
                    Format your response strictly as:
                    Tags: tag1, tag2, tag3
                    Relations: relation1, relation2, relation3
                    """)
    String analyze(@UserMessage String content);
}
