package dev.rabauer.quanta.backend.storage;

import org.eclipse.store.storage.embedded.types.EmbeddedStorage;
import org.eclipse.store.storage.embedded.types.EmbeddedStorageManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Reproduces: GigaMap instance must be stored once initially by a storing context to be connected to it.
 * Verifies that fresh-start and restart both allow gigaMap.store() to succeed.
 */
class StorageInitTest {

    @TempDir
    Path tempDir;

    private StorageRoot initLike_StorageProducer(EmbeddedStorageManager storageManager, StorageRoot candidateRoot) {
        StorageRoot storageRoot = (StorageRoot) storageManager.root();
        if (storageRoot == null) {
            storageRoot = candidateRoot;
            storageManager.setRoot(storageRoot);
            storageManager.storeRoot();
        }
        // Connect each GigaMap so gigaMap.store() works on first run.
        // storeRoot() assigns OIDs but the internal storingContext is only wired
        // during loading (deserialization). One explicit storageManager.store()
        // per GigaMap sets that back-reference regardless of fresh-start or restart.
        storageManager.store(storageRoot.getFileMetadata());
        storageManager.store(storageRoot.getEmbeddings());
        return storageRoot;
    }

    @Test
    void fresh_start_gigaMap_store_does_not_throw() {
        StorageRoot candidateRoot = new StorageRoot();
        EmbeddedStorageManager storageManager = EmbeddedStorage.start(candidateRoot, tempDir);
        try {
            StorageRoot storageRoot = initLike_StorageProducer(storageManager, candidateRoot);

            assertDoesNotThrow(() -> {
                storageRoot.getFileMetadata().add(
                        new FileMetadata("/test/file.txt", 12345L, null, null, null));
                storageRoot.getFileMetadata().store();
            });

            assertEquals(1, storageRoot.getFileMetadata().query(
                    StorageRoot.FILE_PATH_INDEX.is("/test/file.txt")).toList().size());
        } finally {
            storageManager.shutdown();
        }
    }

    @Test
    void restart_gigaMap_store_does_not_throw() {
        // First run – seed one entry
        {
            StorageRoot candidateRoot = new StorageRoot();
            EmbeddedStorageManager storageManager = EmbeddedStorage.start(candidateRoot, tempDir);
            try {
                StorageRoot storageRoot = initLike_StorageProducer(storageManager, candidateRoot);
                storageRoot.getFileMetadata().add(
                        new FileMetadata("/test/file.txt", 12345L, null, null, null));
                storageRoot.getFileMetadata().store();
            } finally {
                storageManager.shutdown();
            }
        }

        // Second run – loaded from disk, store must still work
        {
            StorageRoot candidateRoot = new StorageRoot();
            EmbeddedStorageManager storageManager = EmbeddedStorage.start(candidateRoot, tempDir);
            try {
                StorageRoot storageRoot = initLike_StorageProducer(storageManager, candidateRoot);

                assertDoesNotThrow(() -> {
                    storageRoot.getFileMetadata().add(
                            new FileMetadata("/test/file2.txt", 99999L, null, null, null));
                    storageRoot.getFileMetadata().store();
                });

                assertEquals(2, storageRoot.getFileMetadata()
                        .query(StorageRoot.FILE_PATH_INDEX.is(s -> s != null)).toList().size());
            } finally {
                storageManager.shutdown();
            }
        }
    }
}
