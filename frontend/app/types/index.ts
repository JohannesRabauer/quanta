export interface FileMetadata {
  name: string;
  path: string;
  hash: string;
  summary: string;
  tags?: string;
  relations?: string;
  size?: number;
  last_modified?: string;
}
