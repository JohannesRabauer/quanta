package dev.rabauer.quanta.backend;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Map;

public class EclipseStoreTestResource implements QuarkusTestResourceLifecycleManager {

    private static final Path STORAGE_DIR =
            Paths.get(System.getProperty("java.io.tmpdir"), "eclipsestore-test");

    @Override
    public Map<String, String> start() {
        deleteDirectory(STORAGE_DIR);
        return Map.of("quanta.storage.directory", STORAGE_DIR.toString());
    }

    @Override
    public void stop() {
        deleteDirectory(STORAGE_DIR);
    }

    private void deleteDirectory(Path dir) {
        if (!Files.exists(dir)) {
            return;
        }
        try {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            // ignore
                        }
                    });
        } catch (IOException e) {
            // ignore
        }
    }
}
