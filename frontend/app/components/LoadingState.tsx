export default function LoadingState() {
  return (
    <div className="space-y-3 py-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-white/[0.04] rounded-md w-3/5 shimmer" />
              <div className="h-2.5 bg-white/[0.03] rounded-md w-4/5 shimmer" />
            </div>
            <div className="h-3 bg-white/[0.03] rounded-md w-12 shimmer" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 pt-4">
        <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="text-center text-xs text-cyan-400/60">
        Searching through files...
      </p>
    </div>
  );
}
