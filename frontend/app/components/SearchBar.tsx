interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ query, onQueryChange, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search files by content, tags, or topics..."
          className="search-input w-full px-4 py-3 text-sm rounded-lg bg-gray-800/60 text-white border border-gray-700 focus:border-cyan-500 outline-none placeholder-gray-500"
          autoFocus
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
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
      <button
        onClick={onSearch}
        className="search-button px-5 py-3 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white text-sm transition-all flex-shrink-0"
        aria-label="Search files"
      >
        Search
      </button>
    </div>
  );
}
