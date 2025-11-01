<!--
	README.md for the backend service of the ai-file-search project.
	Purpose: give new developers and operators a clear, Windows-friendly guide to build/run/configure the service.
-->

# ai-file-search — backend

This repository contains the backend service for the ai-file-search project (Quarkus-based). It provides file ingestion, metadata storage, text extraction, embedding generation, retrieval/search and summarization capabilities for files kept in the configured storage.

This README covers project purpose, quick start (Windows / PowerShell), configuration, API overview and the current roadmap status (including work-in-progress items).

## Key features

- Watch a file directory and ingest file metadata
- Extract text from files for indexing
- Generate embeddings for content and store metadata
- Retrieve and search files using semantic + metadata queries
- Summarize text content on demand
- REST API for programmatic access

## Status

- Core backend functionality implemented (file metadata, extraction, embeddings, retrieval, summarization).
- Image analysing and fixing repeated analysing: work in progress — see Roadmap below.

## Quick start (Windows / PowerShell)

Prerequisites

- Java (JDK) compatible with the project (the project uses the Maven wrapper so a system JDK is sufficient).
- Git (optional)
- Internet access for Maven to resolve dependencies on first run.

Recommended commands (PowerShell):

```powershell
# Run in dev mode (live coding)
.\mvnw.cmd quarkus:dev

# Build a packaged app (skip tests for fast iteration)
.\mvnw.cmd -DskipTests package

# Run the produced runnable app (Quarkus layout)
java -jar target\quarkus-app\quarkus-run.jar
```

Notes:

- Use `mvnw.cmd` on Windows (the wrapper is included in the repository). On Unix/macOS use `./mvnw`.
- For native builds or containerized builds, follow Quarkus native guidance — those flows require additional toolchains (GraalVM or container runtime).

## Configuration

Configuration lives in `src/main/resources/application.properties` (and the equivalent config under `target/classes` when packaged). Typical properties to check or override:

- server port and HTTP settings
- storage path or database connection used for file metadata
- embedding provider configuration (API keys, endpoints) — be careful with secrets, prefer environment variables or a secrets store

Set properties via environment variables or JVM arguments when running in production. Example:

```powershell
# Example: set a property via JVM -D flag
java -Dquanta.storage.path=C:\\data\\files -jar target\\quarkus-app\\quarkus-run.jar
```

## API overview

The backend exposes REST endpoints to manage files, metadata, search and summarization. Exact endpoints and payloads are implemented in `src/main/java/dev/rabauer/quanta/backend/resources`.

Common responsibilities exposed by the API:

- Ingest file or register metadata
- List / get file metadata
- Trigger text extraction or summarization for a file
- Run a semantic search / retrieval (query -> ranked results)
- Health and diagnostic endpoints

If you need a fully-specified OpenAPI contract, run the service in dev mode and open the Quarkus Dev UI or the automatic OpenAPI/Swagger endpoint (Quarkus typically serves it at `/q/swagger-ui` in dev mode).

## Development notes

- Source layout: `src/main/java/...` (Quarkus Java project structure).
- Important packages:
	- `filters` — CORS and HTTP filters
	- `resources` — JAX-RS REST endpoints
	- `services` — core business logic (embedding service, retrieval, text extractor, summarizer)
	- `storage` — file metadata entity & repository

- Use the included Maven wrapper (`mvnw` / `mvnw.cmd`) to ensure consistent builds.
- When changing persistent models, ensure repository migrations or schema updates are handled.

## Roadmap and known WIP items

- Improve image analysing (in progress): image content analysis (OCR, scene/text detection) is being added.
- Fix repeated analysing: there's known behaviour where the same file can be re-analyzed multiple times; a fix is being implemented to de-duplicate or detect unchanged files and avoid repeated work.
- Add more end-to-end tests for retrieval and summarization
- Improve CI/CD and publish container images

If you want to help, see the Contribution section below.

## Contributing

1. Fork the repository and create a feature branch.
2. Run tests and linters locally.
3. Open a pull request describing the change and include small, focused commits.

When working on sensitive configuration (API keys, credentials), do not commit secrets — use environment variables or a secrets manager.

## Troubleshooting

- If the app fails to start, check `target/classes/application.properties` and the console logs for binding or missing configuration errors.
- For dependency issues, try clearing the local Maven repository for the project and re-run the wrapper: `.\\mvnw.cmd -U clean package`.

## Contact / Support

If you need help with the backend, open an issue in the repository describing the problem, the steps to reproduce and the relevant logs.

## License

This project does not include an explicit license file in the repository root. Add a `LICENSE` file with the appropriate license before publishing or consult the project owner for the intended license.

---

Notes:
- This README was updated to reflect current project responsibilities and to call out the image analysing and repeated-analysing fix as work-in-progress.

