"use client";

import { useState } from "react";

interface SearchResult {
  fileName: string;
  summary: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/searchFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-[90%] max-w-md mx-auto pt-12">
        <div className="flex justify-center mb-2">
          <img 
            src="/logo.png" 
            alt="AI Owl Logo" 
            style={{ width: '62px', height: '62px', filter: 'invert(1) hue-rotate(180deg) drop-shadow(0 0 10px #00ffff)' }}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-cyan-400 tracking-wider">
          AI File Search
        </h1>
        
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your search query..."
            className="search-input w-full p-4 text-lg rounded-lg"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="search-button absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-md font-semibold"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <p className="loading-text text-xl">Searching through files...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="result-card p-4 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                  {result.fileName}
                </h3>
                <p className="text-gray-300">
                  {result.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No results found for your search.
          </p>
        )}
      </div>
    </main>
  );
}
