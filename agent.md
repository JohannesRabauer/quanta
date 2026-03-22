# Quanta (AI File Search) - Agent Documentation

> **Purpose**: This document provides a comprehensive overview of the Quanta project for AI agents/assistants to quickly understand the codebase, architecture, and development workflows.

---

## 📋 Project Overview

**Quanta** is a local-first AI-powered document search and retrieval system that uses vector embeddings and semantic search to find files based on natural language queries.

### Key Features
- **File Watching**: Automatically monitors a configured folder for new/changed files
- **Smart Ingestion**: Chunks documents, computes embeddings, stores vectors + metadata
- **Semantic Search**: Natural language search powered by local LLM (Ollama)
- **Local-First**: No cloud dependencies - runs entirely on local infrastructure
- **Modern UI**: Next.js frontend with real-time search and metadata exploration

### Technology Stack
- **Frontend**: Next.js 15.5.4 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Backend**: Quarkus 3.28.1, Java 21, Langchain4j 1.2.0
- **Database**: PostgreSQL with pgvector extension
- **AI/ML**: Ollama (local LLM), embedding models
- **Build Tools**: Maven (backend), npm (frontend)
- **Deployment**: Docker Compose

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  - Search Interface                                         │
│  - Results Display (List + Metadata Panel)                 │
│  - Tag Management                                           │
└────────────────┬────────────────────────────────────────────┘
                 │ REST API
┌────────────────▼────────────────────────────────────────────┐
│                  Backend (Quarkus + Langchain4j)            │
│  - FilesResource (REST endpoints)                           │
│  - FileWatcherService (monitors folder)                     │
│  - EmbeddingService (creates embeddings)                    │
│  - SummarizerService (generates summaries)                  │
│  - TagAndRelationService (extracts tags/relations)          │
│  - RetrievalService (semantic search)                       │
└────────────┬──────────────────────┬─────────────────────────┘
             │                      │
┌────────────▼──────────┐  ┌────────▼────────────┐
│  PostgreSQL + pgvector│  │  Ollama Container   │
│  - File metadata      │  │  - LLM models       │
│  - Vector embeddings  │  │  - Embedding models │
│  - Hashes (dedup)     │  │                     │
└───────────────────────┘  └─────────────────────┘
```

---

## 📁 Directory Structure

```
ai-file-search/
├── backend/                    # Quarkus Java backend
│   ├── src/main/java/dev/rabauer/quanta/backend/
│   │   ├── resources/         # REST endpoints
│   │   │   ├── FilesResource.java
│   │   │   └── FileMetadataDto.java
│   │   ├── services/          # Business logic
│   │   │   ├── FileWatcherService.java
│   │   │   ├── EmbeddingService.java
│   │   │   ├── SummarizerService.java
│   │   │   ├── TagAndRelationService.java
│   │   │   ├── RetrievalService.java
│   │   │   └── TextExtractorService.java
│   │   ├── storage/           # Database entities
│   │   │   ├── FileMetadata.java
│   │   │   └── FileMetadataRepository.java
│   │   └── filters/           # HTTP filters
│   │       └── CorsFilter.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml               # Maven dependencies
│   └── Dockerfile.with-build
│
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── MetadataPanel.tsx  # NEW: Collapsible metadata panel
│   │   │   ├── TagList.tsx
│   │   │   ├── RelationList.tsx
│   │   │   ├── EditTagsForm.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── hooks/
│   │   │   └── useFileSearch.ts   # Main search logic hook
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces
│   │   ├── lib/
│   │   │   └── utils.ts           # Helper functions
│   │   ├── page.tsx              # Main page (NEW: Modern split-pane layout)
│   │   ├── layout.tsx
│   │   └── globals.css           # NEW: Modern styling
│   ├── package.json
│   └── Dockerfile
│
├── db/                        # Database setup
│   ├── Dockerfile
│   └── init/                 # SQL initialization scripts
│
├── ollama/                    # Ollama configuration
│   ├── data/                 # Model data (gitignored)
│   └── init/
│       └── run_ollama.sh     # Startup script
│
├── resources/
│   └── demo-files/           # Sample files for testing
│
├── docker-compose.yml        # Full stack orchestration
├── README.md                 # Project documentation
└── agent.md                  # This file
```

---

## 🔌 API Endpoints

### Base URL
- **Development (local)**: `http://localhost:8080`
- **Docker**: `http://localhost:8080`

### Endpoints

#### `GET /api/files/search`
Search for files using semantic search.

**Query Parameters**:
- `query` (string, required): Natural language search query

**Response**: `200 OK`
```json
[
  {
    "name": "filename.txt",
    "path": "/full/path/to/file",
    "hash": "sha256hash",
    "summary": "AI-generated summary of the file",
    "tags": "tag1, tag2, tag3",
    "relations": "related-topic-1, related-topic-2",
    "size": 1024,
    "last_modified": "2026-03-22T10:00:00Z"
  }
]
```

#### `PUT /api/files/tags`
Update tags for a specific file.

**Query Parameters**:
- `path` (string, required): Full file path
- `tags` (string, required): Comma-separated tags

**Response**: `204 No Content`

---

## 🚀 Development Workflows

### Starting the Full Stack

```bash
# Start everything (builds all containers)
docker compose up --build

# Services will be available at:
# - Frontend: http://localhost:3001
# - Backend API: http://localhost:8080
# - Database: localhost:15432
# - Ollama: localhost:11434
```

### Local Development (Recommended)

#### Backend Development
```bash
# Start database, Ollama, and frontend (skip backend container)
docker compose up --scale backend=0

# In a separate terminal, run backend locally
cd backend
./mvnw quarkus:dev

# Backend runs at: http://localhost:8080
# Hot reload enabled - code changes apply automatically
```

#### Frontend Development
```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev

# Frontend runs at: http://localhost:3000 (or next available port)
# Hot reload enabled
```

### Building for Production

```bash
# Backend
cd backend
./mvnw clean package

# Frontend
cd frontend
npm run build
npm start
```

### Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend linting
cd frontend
npm run lint
```

---

## 🔧 Configuration

### Backend Configuration
File: `backend/src/main/resources/application.properties`

Key settings:
- Database connection (JDBC URL, credentials)
- Ollama base URL
- File watch directory path
- Logging levels

### Frontend Configuration
File: `frontend/package.json` and environment variables

Key settings:
- API base URL (defaults to `http://localhost:8080`)
- Build configuration (Turbopack enabled)

### Docker Compose Environment Variables
File: `docker-compose.yml`

Services configured:
- **ollama**: GPU support, model persistence
- **db**: PostgreSQL with pgvector, custom port 15432
- **backend**: Connected to db and Ollama
- **frontend**: Exposed on port 3001

---

## 🗄️ Database Schema

### Table: `file_metadata`
Stores file information and embeddings.

**Key Columns**:
- `id` (bigserial): Primary key
- `path` (text): Unique file path
- `name` (text): File name
- `hash` (text): SHA-256 hash for deduplication
- `summary` (text): AI-generated summary
- `tags` (text): Comma-separated tags
- `relations` (text): Related topics/entities
- `embedding` (vector): pgvector embedding
- `size` (bigint): File size in bytes
- `last_modified` (timestamp): Last modification time

---

## 🎨 Frontend Architecture (Recent Update)

### Modern UI Features (March 2026 Update)
The UI was recently modernized with:

1. **Split-Pane Layout**:
   - Left: Compact file list (filename, path, size)
   - Right: Collapsible metadata panel (shows when file selected)

2. **Key Components**:
   - `ResultCard.tsx`: Compact list item with selection state
   - `MetadataPanel.tsx`: Detailed file view (summary, tags, relations, metadata)
   - `SearchBar.tsx`: Modern search input with icon
   - `useFileSearch.ts`: Custom hook managing search state

3. **Design System**:
   - Color scheme: Cyan accents (#06b6d4) on dark background
   - Tailwind CSS 4 utility classes
   - Smooth transitions and hover effects
   - Custom scrollbars
   - Responsive design (mobile-first)

### State Management
- React hooks for local state
- No external state management library
- Search results stored in component state
- Selected file tracked for metadata panel display

---

## 📝 Common Development Tasks

### Adding a New File Format
1. Update `TextExtractorService.java` to handle the new format
2. Add Apache Tika dependency if needed (already included)
3. Test with sample file in `resources/demo-files/`

### Modifying Search Algorithm
1. Edit `RetrievalService.java`
2. Adjust embedding similarity threshold
3. Modify query preprocessing in Langchain4j integration

### Adding New UI Component
1. Create component in `frontend/app/components/`
2. Add TypeScript types in `frontend/app/types/`
3. Import and use in `page.tsx`
4. Update CSS in `globals.css` if needed

### Changing AI Models
1. Update Ollama model in `ollama/init/run_ollama.sh`
2. Modify model references in `application.properties`
3. Restart Ollama container: `docker compose restart ollama`

---

## 🐛 Troubleshooting

### Backend won't start
- Check database is running: `docker ps | grep db-quanta`
- Verify Ollama is accessible: `curl http://localhost:11434`
- Check logs: `docker logs backend-quanta`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in `CorsFilter.java`
- Inspect browser console for errors

### Database connection issues
- Ensure port 15432 is not in use
- Check credentials match in docker-compose.yml
- Verify pgvector extension is loaded: `docker exec -it db-quanta psql -U quanta -c "SELECT * FROM pg_extension;"`

### Ollama model errors
- Check available models: `docker exec ollama-quanta ollama list`
- Pull required model: `docker exec ollama-quanta ollama pull llama3.2`
- Review Ollama logs: `docker logs ollama-quanta`

---

## 🔐 Security Notes

- Default database password is `not-secure` - **CHANGE FOR PRODUCTION**
- CORS is configured to allow all origins in development
- No authentication/authorization implemented yet
- File paths are exposed in API responses
- Consider adding rate limiting for production use

---

## 📚 Key Dependencies

### Backend
- **Quarkus**: Modern Java framework
- **Langchain4j**: LLM integration framework
- **pgvector**: PostgreSQL vector similarity search
- **Apache Tika**: Document text extraction
- **Hibernate ORM**: Database interaction

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript 5**: Type safety
- **Turbopack**: Fast bundler (enabled)

---

## 🎯 Current Development Status

### ✅ Implemented Features
- File watching and automatic ingestion
- Vector embedding generation
- Semantic search via natural language
- Tag extraction and management
- Summary generation
- Related topics/entities extraction
- Modern split-pane UI with metadata panel
- Docker-based deployment

### 🚧 Known Limitations
- No user authentication
- Single-user system
- Limited file format support (text-based primarily)
- No file preview/viewer
- Basic error handling
- No search history
- No pagination for large result sets

### 💡 Potential Improvements
- Add file preview functionality
- Implement user authentication
- Add search filters (date range, file type, size)
- Pagination for search results
- Export search results
- Dark/light theme toggle
- Keyboard shortcuts
- Advanced query syntax
- File upload via UI

---

## 🔗 Useful Commands

```bash
# View running containers
docker ps

# View all logs
docker compose logs -f

# View specific service logs
docker logs backend-quanta -f

# Restart a service
docker compose restart backend

# Rebuild and restart
docker compose up --build backend

# Access database
docker exec -it db-quanta psql -U quanta -d quanta

# Check Ollama models
docker exec ollama-quanta ollama list

# Clean up everything
docker compose down -v
```

---

## 📞 Getting Help

1. Check the main [README.md](README.md) for setup instructions
2. Review [YouTube live coding sessions](https://www.youtube.com/playlist?list=PLiY7ZRy4r3yYG-MiSm1JrSfVf-OkUozDS)
3. Check container logs for error messages
4. Open an issue on the repository with logs and reproduction steps

---

## 📜 License

See repository root for license details.

---

**Last Updated**: March 22, 2026  
**Version**: 1.0.0-SNAPSHOT  
**Maintainer**: AI File Search Team
