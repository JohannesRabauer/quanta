# PRD: Quanta Chat Interface

## Overview
Add a conversational chat interface to Quanta that lets users query indexed files using natural language and receive grounded, cited answers — extending the existing semantic search capability into a RAG-based Q&A experience.

## Problem
The current search UI returns a ranked list of files but requires the user to open and read each file manually. Users who want a direct answer to a question (e.g. "What does my finance report say about Q3?") must still do that synthesis themselves.

## Goals
- Let users ask questions in natural language and receive a synthesized answer.
- Ground every answer in the indexed file collection and cite the source files.
- Support multi-turn conversations so follow-up questions can reference prior context.
- Integrate seamlessly into the existing Next.js frontend without disrupting the search page.

## Non-Goals
- Replacing the existing semantic search page.
- Multi-user sessions or persistent chat history across browser sessions.
- Cloud LLM dependencies — must stay local-first (Ollama-compatible).

## User Stories
1. As a user, I can navigate to `/chat` and type a natural language question.
2. As a user, I receive a prose answer synthesized from my indexed files.
3. As a user, I see which files were used to generate the answer (citations).
4. As a user, I can ask follow-up questions that build on the previous exchange.
5. As a user, I see a loading indicator while the answer is being generated.
6. As a user, I see a clear error message if the request fails.

## Functional Requirements
1. New `/chat` route in the Next.js frontend.
2. Navigation link between the search page and the chat page.
3. Chat UI: scrollable message history, user input field, send button.
4. Each assistant message includes a citations section listing source file names and paths.
5. Conversation history is sent with each request to enable multi-turn context.
6. New backend endpoint `POST /chat` accepting `{ messages: [{role, content}] }`.
7. Backend retrieves the top-k relevant document chunks via vector similarity.
8. Backend passes retrieved context + conversation history to the LLM and streams or returns the answer.
9. Response includes both `answer` (string) and `sources` (list of file name + path).

## Acceptance Criteria

**AC1 — Grounded answer with citations**
Given at least one relevant file is indexed, when the user submits a natural language question on `/chat`, then the UI displays a prose answer and a citations section listing the name and path of every source file used to generate that answer.

**AC2 — Multi-turn conversation**
Given an active chat session, when the user sends a follow-up question that references a previous exchange (e.g. "Can you elaborate on that?"), then the answer is contextually coherent with the prior messages, and the full conversation history remains visible in the scrollable message thread.

**AC3 — Loading and error feedback**
Given a chat request is in flight, the UI shows a visible loading indicator and disables the send button; if the request fails, a clear error message is shown inline in the chat thread without clearing the conversation history.

## Architecture Change
```
User → /chat page → POST /chat → ChatResource
                                     ↓
                              RetrievalService (vector search)
                                     ↓
                              LLM (Ollama) with context + history
                                     ↓
                              { answer, sources[] }
```
