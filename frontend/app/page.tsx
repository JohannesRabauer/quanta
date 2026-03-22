"use client";

import Image from "next/image";
import { useFileSearch } from "@/app/hooks/useFileSearch";
import SearchBar from "@/app/components/SearchBar";
import ResultCard from "@/app/components/ResultCard";
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

  const hasNoResults = !loading && query && results.length === 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 text-white">
      <div className="w-[90%] max-w-2xl mx-auto pt-12 pb-20">
        <div className="flex justify-center mb-2">
          <Image
            src="/logo.png"
            alt="AI Owl Logo"
            width={62}
            height={62}
            style={{
              filter:
                "invert(1) hue-rotate(180deg) drop-shadow(0 0 10px #00ffff)",
            }}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-cyan-400 tracking-wider">
          Quanta - AI File Search
        </h1>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />

        {loading && <LoadingState />}

        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.map((result) => (
              <ResultCard
                key={result.path}
                result={result}
                isEditing={editingPath === result.path}
                newTags={newTags}
                onNewTagsChange={setNewTags}
                onStartEditing={handleStartEditing}
                onSaveTags={handleUpdateTags}
                onCancelEditing={handleCancelEditing}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}

        {hasNoResults && <EmptyState />}
      </div>
    </main>
  );
}
