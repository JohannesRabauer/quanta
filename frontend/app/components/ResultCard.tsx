import { FileMetadata } from "@/app/types";
import { parseList } from "@/app/lib/utils";
import TagList from "@/app/components/TagList";
import RelationList from "@/app/components/RelationList";
import EditTagsForm from "@/app/components/EditTagsForm";

interface ResultCardProps {
  result: FileMetadata;
  isEditing: boolean;
  newTags: string;
  onNewTagsChange: (value: string) => void;
  onStartEditing: (path: string, currentTags: string) => void;
  onSaveTags: (path: string) => void;
  onCancelEditing: () => void;
  onTagClick: (tag: string) => void;
}

export default function ResultCard({
  result,
  isEditing,
  newTags,
  onNewTagsChange,
  onStartEditing,
  onSaveTags,
  onCancelEditing,
  onTagClick,
}: ResultCardProps) {
  const fileName = result.name.split(/[/\\]/).pop();
  const tags = parseList(result.tags);
  const relations = parseList(result.relations);

  return (
    <div className="result-card p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-cyan-400 break-all">
          {fileName}
        </h3>
        <button
          onClick={() => onStartEditing(result.path, result.tags ?? "")}
          className="text-xs text-gray-400 hover:text-cyan-300"
        >
          Edit Tags
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4 font-mono truncate">
        {result.path}
      </p>

      <p className="text-gray-300 mb-6 leading-relaxed">{result.summary}</p>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Tags
          </h4>
          <TagList tags={tags} onTagClick={onTagClick} />
          {isEditing && (
            <EditTagsForm
              value={newTags}
              onChange={onNewTagsChange}
              onSave={() => onSaveTags(result.path)}
              onCancel={onCancelEditing}
            />
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Related Topics
          </h4>
          <RelationList relations={relations} />
        </div>
      </div>
    </div>
  );
}
