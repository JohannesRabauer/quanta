interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagList({ tags, onTagClick }: TagListProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-gray-600 italic">No tags</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-2.5 py-1 text-xs rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
