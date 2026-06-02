interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagList({ tags, onTagClick }: TagListProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-gray-600/60 italic">No tags</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-500/8 text-cyan-400/90 border border-cyan-500/15 cursor-pointer hover:bg-cyan-500/15 hover:border-cyan-400/30 hover:text-cyan-300 transition-all duration-200 font-medium"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
