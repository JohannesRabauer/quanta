import { FileMetadata, ChatMessage, ChatApiResponse } from "@/app/types";

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function readErrorMessage(response: Response, fallbackMessage: string) {
  const text = await response.text();
  return text || `${fallbackMessage}: ${response.status} ${response.statusText}`;
}

export async function searchFiles(query: string): Promise<FileMetadata[]> {
  const response = await fetch(
    `${API_BASE_URL}/searchFiles?prompt=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Search failed"));
  }
  return response.json();
}

export async function searchByTag(tag: string): Promise<FileMetadata[]> {
  const response = await fetch(
    `${API_BASE_URL}/searchByTag?tag=${encodeURIComponent(tag)}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Tag search failed"));
  }
  return response.json();
}

export async function updateFileTags(
  path: string,
  tags: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/updateTags?path=${encodeURIComponent(path)}`,
    {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: tags,
    }
  );
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Tag update failed"));
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Chat request failed"));
  }
  return response.json();
}
