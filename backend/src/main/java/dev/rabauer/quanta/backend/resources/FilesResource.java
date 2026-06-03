package dev.rabauer.quanta.backend.resources;

import dev.rabauer.quanta.backend.services.RetrievalService;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/")
public class FilesResource {

    @Inject
    RetrievalService retrievalService;

    @Inject
    FileMetadataRepository fileMetadataRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/searchFiles")
    public List<FileMetadataDto> searchFiles(@QueryParam("prompt") String prompt) {
        return retrievalService.findFiles(prompt);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/searchByTag")
    public List<FileMetadataDto> searchByTag(@QueryParam("tag") String tag) {
        return retrievalService.findFilesByTag(tag);
    }

    @POST
    @Path("/updateTags")
    public void updateTags(@QueryParam("path") String path, String tags) {
        fileMetadataRepository.updateTags(path, tags);
    }
}
