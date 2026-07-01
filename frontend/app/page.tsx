"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useFileSearch } from "@/app/hooks/useFileSearch";
import SearchBar from "@/app/components/SearchBar";
import ResultCard from "@/app/components/ResultCard";
import MetadataPanel from "@/app/components/MetadataPanel";
import LoadingState from "@/app/components/LoadingState";
import EmptyState from "@/app/components/EmptyState";

function SearchContent() {
  const {
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
  } = useFileSearch();

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  useEffect(() => {
    if (results.length === 0) {
      setSelectedPath(null);
      return;
    }

    setSelectedPath((currentSelectedPath) => {
      if (currentSelectedPath && results.some((result) => result.path === currentSelectedPath)) {
        return currentSelectedPath;
      }

      return results[0].path;
    });
  }, [results]);

  const hasNoResults = !loading && !error && query.trim().length > 0 && results.length === 0;
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
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-shrink-0 relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image
                src="/logo.png"
                alt="Quanta Logo"
                width={36}
                height={36}
                style={{
                  filter: "invert(1) hue-rotate(180deg) drop-shadow(0 0 10px rgba(6,182,212,0.6))",
                }}
                className="opacity-90"
              />
            </motion.div>
            <motion.h1
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent tracking-wide"
            >
              Quanta
            </motion.h1>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              loading={loading}
            />
          </motion.div>
          <p className="mt-3 text-sm text-gray-500">
            Semantic file search for local content, tags, and related topics.
          </p>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Results List */}
        <motion.div
          layout
          className={`flex-shrink-0 overflow-y-auto transition-all duration-500 ease-in-out ${
            isPanelCollapsed ? "flex-1" : "w-full md:w-2/5 lg:w-1/3"
          }`}
        >
          <div className="p-6 space-y-2">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingState />
                </motion.div>
              )}

              {!loading && results.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-500 mb-3 px-1">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </p>
                  {results.map((result, index) => (
                    <motion.div
                      key={result.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <ResultCard
                        result={result}
                        isSelected={selectedPath === result.path}
                        onSelect={() => handleSelectFile(result.path)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!loading && error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/8 p-4 text-left">
                    <p className="text-sm font-medium text-rose-200">
                      Search unavailable
                    </p>
                    <p className="mt-1 text-xs text-rose-200/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {hasNoResults && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState />
                </motion.div>
              )}

              {!loading && results.length === 0 && !query && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg
                      className="w-16 h-16 mx-auto mb-5 text-gray-700/60"
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
                  </motion.div>
                  <p className="text-gray-500 text-sm">
                    Start searching to discover files
                  </p>
                  <p className="text-gray-600/60 text-xs mt-2">
                    Search by content, tags, or topics
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Metadata Panel */}
        <AnimatePresence mode="wait">
          {!isPanelCollapsed && (
            <motion.div
              key="panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden md:block flex-1 overflow-hidden"
            >
              <MetadataPanel
                result={selectedResult}
                onToggleCollapse={handleTogglePanel}
                isEditing={editingPath === selectedPath}
                newTags={newTags}
                onNewTagsChange={setNewTags}
                onStartEditing={handleStartEditing}
                onSaveTags={handleUpdateTags}
                onCancelEditing={handleCancelEditing}
                onTagClick={handleTagClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {selectedResult && (
          <div className="md:hidden border-t border-white/5 bg-white/[0.02]">
            <MetadataPanel
              result={selectedResult}
              onToggleCollapse={handleTogglePanel}
              isEditing={editingPath === selectedPath}
              newTags={newTags}
              onNewTagsChange={setNewTags}
              onStartEditing={handleStartEditing}
              onSaveTags={handleUpdateTags}
              onCancelEditing={handleCancelEditing}
              onTagClick={handleTagClick}
              showCollapseButton={false}
              className="h-auto"
            />
          </div>
        )}

        {/* Collapsed Panel Button */}
        <AnimatePresence>
          {isPanelCollapsed && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={handleTogglePanel}
              className="hidden md:flex items-center justify-center flex-shrink-0 w-10 border-l border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
              aria-label="Expand panel"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors"
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
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <LoadingState />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
