export interface FileMetadata {
  name: string;
  path: string;
  lastModified?: number | null;
  summary?: string | null;
  tags?: string | null;
  relations?: string | null;
}
