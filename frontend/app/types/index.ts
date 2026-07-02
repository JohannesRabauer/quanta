export interface FileMetadata {
  name: string;
  path: string;
  lastModified?: number | null;
  summary?: string | null;
  tags?: string | null;
  relations?: string | null;
}

export interface ChatSource {
  name: string;
  path: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

export interface ChatApiResponse {
  answer: string;
  sources: ChatSource[];
}
