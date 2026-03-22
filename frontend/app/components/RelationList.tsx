interface RelationListProps {
  relations: string[];
}

export default function RelationList({ relations }: RelationListProps) {
  if (relations.length === 0) {
    return (
      <span className="text-xs text-gray-600 italic">No relations found</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {relations.map((rel) => (
        <span
          key={rel}
          className="px-2.5 py-1 text-xs rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30"
        >
          {rel}
        </span>
      ))}
    </div>
  );
}
