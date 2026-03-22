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
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-900/60 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
        placeholder="tag1, tag2, tag3..."
        autoFocus
      />
      <button
        onClick={onSave}
        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="text-xs px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
