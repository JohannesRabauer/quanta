import { FileMetadata } from "@/app/types";

interface ResultCardProps {
  result: FileMetadata;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ResultCard({
  result,
  isSelected,
  onSelect,
}: ResultCardProps) {
  const fileName = result.name.split(/[/\\]/).pop();
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
        isSelected
          ? "bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
          : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-cyan-500/30"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 transition-colors ${
                isSelected ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"
              }`}
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
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-medium truncate transition-colors ${
              isSelected ? "text-cyan-300" : "text-gray-200 group-hover:text-cyan-300"
            }`}>
              {fileName}
            </h3>
            <p className="text-xs text-gray-500 font-mono truncate mt-0.5">
              {result.path}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 text-xs text-gray-500 font-medium">
          {formatFileSize(result.size)}
        </div>
      </div>
    </div>
  );
}
