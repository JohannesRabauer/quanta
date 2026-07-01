"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
  loading,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <form
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <motion.div
        className={`relative flex-1 rounded-xl transition-all duration-300 ${
          isFocused ? "glow-cyan" : ""
        }`}
        animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4.5 h-4.5 transition-colors duration-200 ${
              isFocused ? "text-cyan-400" : "text-gray-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search files by content, tags, or topics..."
          className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-white/[0.04] text-white border border-white/[0.08] focus:border-cyan-500/50 focus:bg-white/[0.06] outline-none placeholder-gray-500 transition-all duration-200"
          autoFocus
          aria-label="Search files"
        />
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || !query.trim()}
        className="px-6 py-3.5 rounded-xl font-medium bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed text-white text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex-shrink-0"
        aria-label="Search files"
      >
        {loading ? "Searching..." : "Search"}
      </motion.button>
    </form>
  );
}
