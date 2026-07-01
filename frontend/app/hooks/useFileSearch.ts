"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileMetadata } from "@/app/types";
import { searchFiles, searchByTag, updateFileTags } from "@/app/lib/api";
import { normalizeListInput } from "@/app/lib/utils";

type SearchMode = "query" | "tag";

interface UseFileSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  results: FileMetadata[];
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [newTags, setNewTags] = useState("");
  const lastRequestKeyRef = useRef<string | null>(null);
  const latestRequestIdRef = useRef(0);

  const clearResults = useCallback(() => {
    latestRequestIdRef.current += 1;
    lastRequestKeyRef.current = null;
    setResults([]);
    setLoading(false);
    setError(null);
    setEditingPath(null);
    setNewTags("");
  }, []);

  const executeSearch = useCallback(
    async (mode: SearchMode, value: string, options?: { force?: boolean }) => {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        clearResults();
        return;
      }

      const requestKey = `${mode}:${normalizedValue.toLowerCase()}`;
      if (!options?.force && lastRequestKeyRef.current === requestKey) {
        setQuery(normalizedValue);
        return;
      }

      lastRequestKeyRef.current = requestKey;
      const requestId = ++latestRequestIdRef.current;
      setQuery(normalizedValue);
      setLoading(false);
      setLoading(true);
      setError(null);

      try {
        const data =
          mode === "tag"
            ? await searchByTag(normalizedValue)
            : await searchFiles(normalizedValue);

        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        setResults(data);
        setEditingPath(null);
      } catch (error) {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        console.error("Error fetching search results:", error);
        lastRequestKeyRef.current = null;
        setResults([]);
        setEditingPath(null);
        setError(
          mode === "tag"
            ? "Could not load files for this tag."
            : "Could not search files right now."
        );
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [clearResults]
  );

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlTag = searchParams.get("tag");

    if (urlQuery?.trim()) {
      void executeSearch("query", urlQuery);
      return;
    }

    if (urlTag?.trim()) {
      void executeSearch("tag", urlTag);
      return;
    }

    setQuery("");
    clearResults();
  }, [clearResults, executeSearch, searchParams]);

  const handleSearch = async () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      router.replace("/");
      setQuery("");
      clearResults();
      return;
    }

    router.replace(`/?q=${encodeURIComponent(normalizedQuery)}`);
    await executeSearch("query", normalizedQuery, { force: true });
  };

  const handleTagClick = async (tag: string) => {
    const normalizedTag = tag.trim();
    if (!normalizedTag) {
      return;
    }

    router.replace(`/?tag=${encodeURIComponent(normalizedTag)}`);
    await executeSearch("tag", normalizedTag, { force: true });
  };

  const handleUpdateTags = async (path: string) => {
    const normalizedTags = normalizeListInput(newTags);

    try {
      await updateFileTags(path, normalizedTags);
      setResults((currentResults) =>
        currentResults.map((result) =>
          result.path === path ? { ...result, tags: normalizedTags || null } : result
        )
      );
      setNewTags(normalizedTags);
      setEditingPath(null);
      setError(null);
    } catch (error) {
      console.error("Error updating tags:", error);
      setError("Could not save tags right now.");
    }
  };

  const handleStartEditing = (path: string, currentTags: string) => {
    setEditingPath(path);
    setNewTags(normalizeListInput(currentTags));
  };

  const handleCancelEditing = () => {
    setEditingPath(null);
    setNewTags("");
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
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
