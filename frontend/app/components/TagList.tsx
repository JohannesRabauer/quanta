interface TagListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagList({ tags, onTagClick }: TagListProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-gray-600 italic">No tags</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-2 py-1 text-xs rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800/50 cursor-pointer hover:bg-cyan-500 hover:text-black transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
