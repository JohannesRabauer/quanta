package dev.rabauer.quanta.backend;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Map;

public class PostgresTestResource implements QuarkusTestResourceLifecycleManager {

    private static final DockerImageName PGVECTOR_IMAGE =
            DockerImageName.parse("pgvector/pgvector:pg17")
                    .asCompatibleSubstituteFor("postgres");

    private PostgreSQLContainer<?> container;

    @Override
    public Map<String, String> start() {
        container = new PostgreSQLContainer<>(PGVECTOR_IMAGE)
                .withDatabaseName("quanta")
                .withUsername("quanta")
                .withPassword("not-secure");
        container.start();

        try (Connection conn = DriverManager.getConnection(
                container.getJdbcUrl(), container.getUsername(), container.getPassword());
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE EXTENSION IF NOT EXISTS vector");
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize pgvector extension", e);
        }

        return Map.of(
                "quarkus.datasource.jdbc.url", container.getJdbcUrl(),
                "quarkus.datasource.username", container.getUsername(),
                "quarkus.datasource.password", container.getPassword(),
                "quanta.filesystem.path", System.getProperty("java.io.tmpdir")
        );
    }

    @Override
    public void stop() {
        if (container != null) {
            container.stop();
        }
    }
}
