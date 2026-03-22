interface EditTagsFormProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditTagsForm({
  value,
  onChange,
  onSave,
  onCancel,
}: EditTagsFormProps) {
  return (
    <div className="mt-2 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
        placeholder="tag1, tag2..."
        autoFocus
      />
      <button
        onClick={onSave}
        className="bg-cyan-600 text-xs px-3 py-1 rounded"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="text-xs px-3 py-1 rounded bg-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}
