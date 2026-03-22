export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
      <p className="loading-text mt-4 text-sm text-cyan-400">
        Searching through files...
      </p>
    </div>
  );
}
