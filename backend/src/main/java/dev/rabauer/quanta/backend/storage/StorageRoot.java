package dev.rabauer.quanta.backend.storage;

import org.eclipse.store.gigamap.types.GigaMap;
import org.eclipse.store.gigamap.types.IndexerString;

public class StorageRoot {

    public static final IndexerString<FileMetadata> FILE_PATH_INDEX =
            new IndexerString.Abstract<>() {
                @Override
                public String getString(FileMetadata e) {
                    return e.getPath();
                }
            };

    public static final IndexerString<EmbeddingEntry> EMBEDDING_UUID_INDEX =
            new IndexerString.Abstract<>() {
                @Override
                public String getString(EmbeddingEntry e) {
                    return e.getUuid();
                }
            };

    private final GigaMap<FileMetadata> fileMetadata = GigaMap.<FileMetadata>Builder()
            .withBitmapIdentityIndex(FILE_PATH_INDEX)
            .build();

    private final GigaMap<EmbeddingEntry> embeddings = GigaMap.<EmbeddingEntry>Builder()
            .withBitmapIdentityIndex(EMBEDDING_UUID_INDEX)
            .build();

    public GigaMap<FileMetadata> getFileMetadata() {
        return fileMetadata;
    }

    public GigaMap<EmbeddingEntry> getEmbeddings() {
        return embeddings;
    }
}
