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
    <div className="flex flex-wrap gap-2">
      {relations.map((rel) => (
        <span
          key={rel}
          className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-300 border border-purple-800/50"
        >
          {rel}
        </span>
      ))}
    </div>
  );
}
