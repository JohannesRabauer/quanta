import { FileMetadata } from "@/app/types";

const API_BASE_URL = "http://localhost:8080";

export async function searchFiles(query: string): Promise<FileMetadata[]> {
  const response = await fetch(`${API_BASE_URL}/searchFiles`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query,
  });
  if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
  return response.json();
}

export async function searchByTag(tag: string): Promise<FileMetadata[]> {
  const response = await fetch(
    `${API_BASE_URL}/searchByTag?tag=${encodeURIComponent(tag)}`
  );
  if (!response.ok) throw new Error(`Tag search failed: ${response.statusText}`);
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
  if (!response.ok) throw new Error(`Tag update failed: ${response.statusText}`);
}
