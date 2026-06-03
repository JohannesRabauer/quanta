package dev.rabauer.quanta.backend;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;

import java.util.Map;

public class PostgresTestResource implements QuarkusTestResourceLifecycleManager {

    @Override
    public Map<String, String> start() {
        return Map.of(
                "quanta.filesystem.path", System.getProperty("java.io.tmpdir")
        );
    }

    @Override
    public void stop() {
    }
}
