"use client";

import { FileMetadata } from "@/app/types";
import { parseList } from "@/app/lib/utils";
import TagList from "@/app/components/TagList";
import RelationList from "@/app/components/RelationList";
import EditTagsForm from "@/app/components/EditTagsForm";

interface MetadataPanelProps {
  result: FileMetadata | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isEditing: boolean;
  newTags: string;
  onNewTagsChange: (value: string) => void;
  onStartEditing: (path: string, currentTags: string) => void;
  onSaveTags: (path: string) => void;
  onCancelEditing: () => void;
  onTagClick: (tag: string) => void;
}

export default function MetadataPanel({
  result,
  onToggleCollapse,
  isEditing,
  newTags,
  onNewTagsChange,
  onStartEditing,
  onSaveTags,
  onCancelEditing,
  onTagClick,
}: MetadataPanelProps) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        <div className="text-center px-4">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Select a file to view details</p>
        </div>
      </div>
    );
  }

  const fileName = result.name.split(/[/\\]/).pop();
  const tags = parseList(result.tags);
  const relations = parseList(result.relations);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 border-l border-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
          File Details
        </h2>
        <button
          onClick={onToggleCollapse}
          className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
          aria-label="Collapse panel"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* File Name */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-300 break-all mb-2">
            {fileName}
          </h3>
          <p className="text-xs text-gray-500 font-mono break-all">
            {result.path}
          </p>
        </div>

        {/* Summary */}
        {result.summary && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Summary
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {result.summary}
            </p>
          </div>
        )}

        {/* File Info */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500">Size:</span>
              <span className="text-xs text-gray-300 font-medium">
                {formatFileSize(result.size)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500">Modified:</span>
              <span className="text-xs text-gray-300 font-medium text-right">
                {formatDate(result.last_modified)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500">Hash:</span>
              <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]" title={result.hash}>
                {result.hash.substring(0, 12)}...
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tags
            </h4>
            <button
              onClick={() => onStartEditing(result.path, result.tags ?? "")}
              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Edit
            </button>
          </div>
          <TagList tags={tags} onTagClick={onTagClick} />
          {isEditing && (
            <div className="mt-3">
              <EditTagsForm
                value={newTags}
                onChange={onNewTagsChange}
                onSave={() => onSaveTags(result.path)}
                onCancel={onCancelEditing}
              />
            </div>
          )}
        </div>

        {/* Relations */}
        {relations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Related Topics
            </h4>
            <RelationList relations={relations} />
          </div>
        )}
      </div>
    </div>
  );
}
