package dev.rabauer.quanta.backend.resources;

import dev.rabauer.quanta.backend.services.RetrievalService;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/")
public class FilesResource {

    @Inject
    RetrievalService retrievalService;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/searchFiles")
    public List<FileMetadataDto> searchFiles(String prompt) {
        return retrievalService.findFiles(prompt);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/fileSummary")
    public FileMetadataDto getFileSummary(String fileHash) {
        // TODO
        return new FileMetadataDto("", "", "", "");
    }
}
