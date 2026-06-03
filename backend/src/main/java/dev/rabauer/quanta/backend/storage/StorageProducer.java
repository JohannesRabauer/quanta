package dev.rabauer.quanta.backend.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.store.storage.embedded.types.EmbeddedStorage;
import org.eclipse.store.storage.embedded.types.EmbeddedStorageManager;

import java.nio.file.Paths;

@ApplicationScoped
public class StorageProducer {

    @ConfigProperty(name = "quanta.storage.directory", defaultValue = "eclipsestore-data")
    String storageDirectory;

    private EmbeddedStorageManager storageManager;
    private StorageRoot storageRoot;

    private synchronized void init() {
        if (storageManager != null) {
            return;
        }
        StorageRoot root = new StorageRoot();
        storageManager = EmbeddedStorage.start(root, Paths.get(storageDirectory));
        storageRoot = (StorageRoot) storageManager.root();
        if (storageRoot == null) {
            storageRoot = root;
            storageManager.setRoot(storageRoot);
            storageManager.storeRoot();
        }
    }

    @Produces
    @Singleton
    public EmbeddedStorageManager storageManager() {
        init();
        return storageManager;
    }

    @Produces
    @Singleton
    public StorageRoot storageRoot() {
        init();
        return storageRoot;
    }
}
