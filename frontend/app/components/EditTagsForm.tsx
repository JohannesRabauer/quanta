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
        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
        placeholder="tag1, tag2, tag3..."
        autoFocus
      />
      <button
        onClick={onSave}
        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-cyan-500/20"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="text-xs px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 transition-colors border border-white/[0.06]"
      >
        Cancel
      </button>
    </div>
  );
}
