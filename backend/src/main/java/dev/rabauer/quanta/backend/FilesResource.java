package dev.rabauer.quanta.backend;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/")
public class FilesResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/searchFiles")
    public List<FileMetadata> searchFiles(String prompt) {
        // TODO
        return List.of(new FileMetadata("","","",""));
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/fileSummary")
    public FileMetadata getFileSummary(String fileHash) {
        // TODO
        return new FileMetadata("","","","");
    }
}
