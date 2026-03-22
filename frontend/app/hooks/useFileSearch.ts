"use client";

import { useState } from "react";
import { FileMetadata } from "@/app/types";
import { searchFiles, searchByTag, updateFileTags } from "@/app/lib/api";

interface UseFileSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  results: FileMetadata[];
  loading: boolean;
  editingPath: string | null;
  newTags: string;
  setNewTags: (value: string) => void;
  handleSearch: () => Promise<void>;
  handleTagClick: (tag: string) => Promise<void>;
  handleUpdateTags: (path: string) => Promise<void>;
  handleStartEditing: (path: string, currentTags: string) => void;
  handleCancelEditing: () => void;
}

export function useFileSearch(): UseFileSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [newTags, setNewTags] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchFiles(query);
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tag: string) => {
    setQuery(tag);
    setLoading(true);
    try {
      const data = await searchByTag(tag);
      setResults(data);
    } catch (error) {
      console.error("Error searching by tag:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTags = async (path: string) => {
    try {
      await updateFileTags(path, newTags);
      setResults(results.map((r) => (r.path === path ? { ...r, tags: newTags } : r)));
      setEditingPath(null);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  const handleStartEditing = (path: string, currentTags: string) => {
    setEditingPath(path);
    setNewTags(currentTags);
  };

  const handleCancelEditing = () => {
    setEditingPath(null);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    editingPath,
    newTags,
    setNewTags,
    handleSearch,
    handleTagClick,
    handleUpdateTags,
    handleStartEditing,
    handleCancelEditing,
  };
}
