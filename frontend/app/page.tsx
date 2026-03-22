"use client";

import { useState } from "react";

interface FileMetadata {
  name: string;
  path: string;
  hash: string;
  summary: string;
  tags?: string;
  relations?: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [newTags, setNewTags] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/searchFiles", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });
      const data = await response.json();
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
      const response = await fetch(`http://localhost:8080/searchByTag?tag=${encodeURIComponent(tag)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching by tag:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTags = async (path: string) => {
    try {
      await fetch(`http://localhost:8080/updateTags?path=${encodeURIComponent(path)}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: newTags,
      });
      // Refresh results to show new tags
      setResults(results.map(r => r.path === path ? { ...r, tags: newTags } : r));
      setEditingPath(null);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const parseList = (str: string | undefined) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 text-white">
      <div className="w-[90%] max-w-2xl mx-auto pt-12 pb-20">
        <div className="flex justify-center mb-2">
          <img 
            src="/logo.png" 
            alt="AI Owl Logo" 
            style={{ width: '62px', height: '62px', filter: 'invert(1) hue-rotate(180deg) drop-shadow(0 0 10px #00ffff)' }}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-cyan-400 tracking-wider">
          Quanta - AI File Search
        </h1>
        
        <div className="mb-8 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by text or click a tag..."
            className="search-input flex-1 p-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-cyan-400 outline-none"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="search-button px-6 py-4 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            aria-label="Search files"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <p className="loading-text text-xl text-cyan-300 animate-pulse">Searching through files...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="result-card p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-cyan-400 break-all">
                    {result.name.split(/[/\\]/).pop()}
                  </h3>
                  <button 
                    onClick={() => { setEditingPath(result.path); setNewTags(result.tags || ""); }}
                    className="text-xs text-gray-400 hover:text-cyan-300"
                  >
                    Edit Tags
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 font-mono truncate">{result.path}</p>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {result.summary}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {parseList(result.tags).map((tag, i) => (
                        <span 
                          key={i} 
                          onClick={() => handleTagClick(tag)}
                          className="px-2 py-1 text-xs rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800/50 cursor-pointer hover:bg-cyan-500 hover:text-black transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {parseList(result.tags).length === 0 && <span className="text-xs text-gray-600 italic">No tags</span>}
                    </div>
                  </div>

                  {editingPath === result.path && (
                    <div className="mt-2 flex gap-2">
                      <input 
                        type="text" 
                        value={newTags} 
                        onChange={(e) => setNewTags(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        placeholder="tag1, tag2..."
                        autoFocus
                      />
                      <button onClick={() => handleUpdateTags(result.path)} className="bg-cyan-600 text-xs px-3 py-1 rounded">Save</button>
                      <button onClick={() => setEditingPath(null)} className="text-xs px-3 py-1 rounded bg-gray-700">Cancel</button>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {parseList(result.relations).map((rel, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-300 border border-purple-800/50"
                        >
                          {rel}
                        </span>
                      ))}
                      {parseList(result.relations).length === 0 && <span className="text-xs text-gray-600 italic">No relations found</span>}
                    </div>
                  </div>
                </div>
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
