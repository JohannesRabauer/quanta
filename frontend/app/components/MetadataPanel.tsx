"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileMetadata } from "@/app/types";
import { parseList } from "@/app/lib/utils";
import TagList from "@/app/components/TagList";
import RelationList from "@/app/components/RelationList";
import EditTagsForm from "@/app/components/EditTagsForm";

interface MetadataPanelProps {
  result: FileMetadata | null;
  onToggleCollapse: () => void;
  isEditing: boolean;
  newTags: string;
  onNewTagsChange: (value: string) => void;
  onStartEditing: (path: string, currentTags: string) => void;
  onSaveTags: (path: string) => void;
  onCancelEditing: () => void;
  onTagClick: (tag: string) => void;
  showCollapseButton?: boolean;
  className?: string;
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
  showCollapseButton = true,
  className = "",
}: MetadataPanelProps) {
  if (!result) {
    return (
      <div
        className={`h-full flex items-center justify-center text-gray-600 text-sm ${
          showCollapseButton ? "border-l border-white/5" : ""
        } ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-14 h-14 mx-auto mb-4 text-gray-700/50"
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
          </motion.div>
          <p className="text-gray-500/80 text-sm">Select a file to view details</p>
        </motion.div>
      </div>
    );
  }

  const fileName = result.name || result.path.split(/[/\\]/).pop() || result.path;
  const tags = parseList(result.tags);
  const relations = parseList(result.relations);
  const fileExtension = fileName.includes(".")
    ? fileName.split(".").pop()?.toUpperCase()
    : "Unknown";

  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const infoItems = [
    { label: "Type", value: fileExtension || "Unknown", mono: true },
    { label: "Modified", value: formatDate(result.lastModified) },
  ];

  return (
    <div
      className={`h-full flex flex-col bg-white/[0.01] ${
        showCollapseButton ? "border-l border-white/5" : ""
      } ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-cyan-400/80 uppercase tracking-widest">
          File Details
        </h2>
        {showCollapseButton && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
            aria-label="Collapse panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result.path}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-6"
        >
          {/* File Name */}
          <div>
            <h3 className="text-lg font-semibold text-white break-all mb-1.5">
              {fileName}
            </h3>
            <p className="text-[11px] text-gray-500/80 font-mono break-all leading-relaxed">
              {result.path}
            </p>
          </div>

          {/* Summary */}
          {result.summary && (
            <div>
              <SectionHeader>Summary</SectionHeader>
              <p className="text-sm text-gray-400 leading-relaxed">
                {result.summary}
              </p>
            </div>
          )}

          {/* File Info */}
          <div>
            <SectionHeader>Information</SectionHeader>
            <div className="space-y-0 rounded-xl overflow-hidden border border-white/[0.05]">
              {infoItems.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex justify-between items-center px-3.5 py-2.5 bg-white/[0.02] ${
                    index !== infoItems.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span
                    className={`text-xs text-gray-300 ${item.mono ? "font-mono" : "font-medium"}`}
                    title={item.value}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionHeader noMargin>Tags</SectionHeader>
              <button
                onClick={() => onStartEditing(result.path, result.tags ?? "")}
                className="text-[11px] text-cyan-500/80 hover:text-cyan-400 transition-colors font-medium"
              >
                Edit
              </button>
            </div>
            <TagList tags={tags} onTagClick={onTagClick} />
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    <EditTagsForm
                      value={newTags}
                      onChange={onNewTagsChange}
                      onSave={() => onSaveTags(result.path)}
                      onCancel={onCancelEditing}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Relations */}
          {relations.length > 0 && (
            <div>
              <SectionHeader>Related Topics</SectionHeader>
              <RelationList relations={relations} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({
  children,
  noMargin,
}: {
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <h4
      className={`text-[11px] font-semibold uppercase tracking-widest text-gray-500/70 ${
        noMargin ? "" : "mb-3"
      }`}
    >
      {children}
    </h4>
  );
}
