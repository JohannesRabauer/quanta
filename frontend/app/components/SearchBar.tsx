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
    <div className="mb-8 flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search by text or click a tag..."
        className="search-input flex-1 p-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-cyan-400 outline-none"
        autoFocus
      />
      <button
        onClick={onSearch}
        className="search-button px-6 py-4 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
        aria-label="Search files"
      >
        Search
      </button>
    </div>
  );
}
