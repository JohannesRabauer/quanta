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
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (name?: string) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "bg-cyan-500/8 border-cyan-500/30 shadow-lg shadow-cyan-500/5"
          : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-cyan-500/20"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
              isSelected
                ? "bg-cyan-500/15 text-cyan-400"
                : "bg-white/[0.04] text-gray-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10"
            }`}
          >
            {getFileIcon(fileName)}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-sm font-medium truncate transition-colors duration-200 ${
                isSelected
                  ? "text-cyan-300"
                  : "text-gray-200 group-hover:text-white"
              }`}
            >
              {fileName}
            </h3>
            <p className="text-[11px] text-gray-500/80 font-mono truncate mt-0.5">
              {result.path}
            </p>
          </div>
        </div>

        {result.size && (
          <div className="flex-shrink-0 text-[11px] text-gray-500 font-medium tabular-nums">
            {formatFileSize(result.size)}
          </div>
        )}
      </div>

      {result.summary && (
        <p
          className={`mt-2.5 text-xs leading-relaxed line-clamp-2 transition-colors duration-200 ${
            isSelected ? "text-gray-400" : "text-gray-500/80"
          }`}
        >
          {result.summary}
        </p>
      )}
    </div>
  );
}
