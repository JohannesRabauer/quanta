export default function EmptyState() {
  return (
    <div className="text-center py-12">
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
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-gray-500 text-sm">
        No results found for your search.
      </p>
      <p className="text-gray-600 text-xs mt-2">
        Try different keywords or click on a tag
      </p>
    </div>
  );
}
