package dev.rabauer.quanta.backend.resources;

import dev.rabauer.quanta.backend.services.RetrievalService;
import dev.rabauer.quanta.backend.storage.FileMetadataRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
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
        return retrievalService.findFiles(requireNonBlank(prompt, "prompt"));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/searchByTag")
    public List<FileMetadataDto> searchByTag(@QueryParam("tag") String tag) {
        return retrievalService.findFilesByTag(requireNonBlank(tag, "tag"));
    }

    @POST
    @Path("/updateTags")
    @Transactional
    public void updateTags(@QueryParam("path") String path, String tags) {
        String normalizedPath = requireNonBlank(path, "path");
        boolean updated = fileMetadataRepository.updateTags(normalizedPath, tags);
        if (!updated) {
            throw new NotFoundException("No file metadata found for path: " + normalizedPath);
        }
    }

    private String requireNonBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException(fieldName + " must not be blank");
        }
        return value.trim();
    }
}
