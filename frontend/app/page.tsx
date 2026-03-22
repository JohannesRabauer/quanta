"use client";

import { useState } from "react";
import Image from "next/image";
import { useFileSearch } from "@/app/hooks/useFileSearch";
import SearchBar from "@/app/components/SearchBar";
import ResultCard from "@/app/components/ResultCard";
import MetadataPanel from "@/app/components/MetadataPanel";
import LoadingState from "@/app/components/LoadingState";
import EmptyState from "@/app/components/EmptyState";

export default function Home() {
  const {
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
  } = useFileSearch();

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const hasNoResults = !loading && query && results.length === 0;
  const selectedResult = results.find((r) => r.path === selectedPath) || null;

  const handleSelectFile = (path: string) => {
    setSelectedPath(path);
    if (isPanelCollapsed) {
      setIsPanelCollapsed(false);
    }
  };

  const handleTogglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="AI Owl Logo"
              width={40}
              height={40}
              style={{
                filter:
                  "invert(1) hue-rotate(180deg) drop-shadow(0 0 8px #00ffff)",
              }}
              className="opacity-90"
            />
            <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">
              Quanta
            </h1>
          </div>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Results List */}
        <div
          className={`flex-shrink-0 overflow-y-auto transition-all duration-300 ${
            isPanelCollapsed ? "flex-1" : "w-full md:w-2/5 lg:w-1/3"
          }`}
        >
          <div className="p-6 space-y-2">
            {loading && <LoadingState />}

            {results.length > 0 &&
              results.map((result) => (
                <ResultCard
                  key={result.path}
                  result={result}
                  isSelected={selectedPath === result.path}
                  onSelect={() => handleSelectFile(result.path)}
                />
              ))}

            {hasNoResults && <EmptyState />}

            {!loading && results.length === 0 && !query && (
              <div className="text-center py-20 text-gray-600">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-lg">Start searching to find files</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Panel */}
        {!isPanelCollapsed && (
          <div className="hidden md:block flex-1 overflow-hidden">
            <MetadataPanel
              result={selectedResult}
              isCollapsed={isPanelCollapsed}
              onToggleCollapse={handleTogglePanel}
              isEditing={editingPath === selectedPath}
              newTags={newTags}
              onNewTagsChange={setNewTags}
              onStartEditing={handleStartEditing}
              onSaveTags={handleUpdateTags}
              onCancelEditing={handleCancelEditing}
              onTagClick={handleTagClick}
            />
          </div>
        )}

        {/* Collapsed Panel Button */}
        {isPanelCollapsed && (
          <button
            onClick={handleTogglePanel}
            className="hidden md:block flex-shrink-0 w-12 border-l border-gray-800 bg-gray-900/30 hover:bg-gray-800/50 transition-colors group"
            aria-label="Expand panel"
          >
            <svg
              className="w-6 h-6 mx-auto text-gray-600 group-hover:text-cyan-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>
    </main>
  );
}
