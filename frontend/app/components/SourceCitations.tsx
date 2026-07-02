import { ChatSource } from "@/app/types";

interface SourceCitationsProps {
  sources: ChatSource[];
}

export default function SourceCitations({ sources }: SourceCitationsProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Sources</p>
      <ul className="space-y-1">
        {sources.map((source) => (
          <li key={source.path} className="flex items-start gap-2">
            <svg
              className="w-3.5 h-3.5 text-cyan-500/70 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-xs text-cyan-300/80 font-medium truncate">{source.name}</p>
              <p className="text-xs text-gray-600 truncate">{source.path}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
