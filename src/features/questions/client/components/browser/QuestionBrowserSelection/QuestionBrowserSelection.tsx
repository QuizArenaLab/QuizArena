import React from "react";
import { ComponentRegistry } from "@/registry";
import { useQuestionBrowser } from "../../../browser/QuestionBrowserContext";
import { QuestionBrowserMode } from "../../../browser/QuestionBrowserMode";

export interface QuestionBrowserSelectionProps {
  className?: string;
  onSelectModeChange?: (mode: QuestionBrowserMode) => void;
}

export function QuestionBrowserSelection({
  className = "",
  onSelectModeChange,
}: QuestionBrowserSelectionProps) {
  const { state, setMode, clearSelection } = useQuestionBrowser();
  const selectedCount = state.selectedIds.size;
  const isSelectMode = state.mode === QuestionBrowserMode.SELECT;

  if (selectedCount === 0 && !isSelectMode) {
    return null; // Don't show anything if not in select mode and nothing is selected
  }

  return (
    <div
      className={`flex items-center gap-4 bg-primary-50 px-4 py-2 rounded-lg border border-primary-100 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center bg-primary-600 text-white text-xs font-bold w-6 h-6 rounded-full">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-primary-900">Questions Selected</span>
      </div>

      <div className="h-4 w-[1px] bg-primary-200" />

      <button
        type="button"
        onClick={() => {
          clearSelection();
          if (isSelectMode && onSelectModeChange) {
            onSelectModeChange(QuestionBrowserMode.BROWSE);
          }
        }}
        className="text-sm font-medium text-primary-700 hover:text-primary-800"
      >
        Clear Selection
      </button>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-selection",
  name: "QuestionBrowserSelection",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserSelection";
