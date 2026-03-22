"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [newTags, setNewTags] = useState("");

  // Load query from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlTag = searchParams.get("tag");
    
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery, false);
    } else if (urlTag) {
      setQuery(urlTag);
      performTagSearch(urlTag);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, isTag: boolean = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = isTag 
        ? await searchByTag(searchQuery)
        : await searchFiles(searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const performTagSearch = async (tag: string) => {
    if (!tag.trim()) return;

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

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Update URL
    router.push(`/?q=${encodeURIComponent(query)}`);
    
    await performSearch(query, false);
  };

  const handleTagClick = async (tag: string) => {
    setQuery(tag);
    
    // Update URL
    router.push(`/?tag=${encodeURIComponent(tag)}`);
    
    await performTagSearch(tag);
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
