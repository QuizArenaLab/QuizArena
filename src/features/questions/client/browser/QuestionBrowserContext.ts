import { createContext, useContext } from "react";
import { QuestionBrowserState } from "./QuestionBrowserState";
import { QuestionBrowserMode } from "./QuestionBrowserMode";
import { QuestionBrowserView } from "./QuestionBrowserView";
import { QuestionBrowserCapabilities } from "./QuestionBrowserCapabilities";

export interface QuestionBrowserContextValue {
  state: QuestionBrowserState;
  capabilities: QuestionBrowserCapabilities;

  // Actions
  setMode: (mode: QuestionBrowserMode) => void;
  setView: (view: QuestionBrowserView) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  setHovered: (id: string | null) => void;
  setPreview: (id: string | null) => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
}

export const QuestionBrowserContext = createContext<QuestionBrowserContextValue | undefined>(
  undefined
);

export function useQuestionBrowser() {
  const context = useContext(QuestionBrowserContext);
  if (!context) {
    throw new Error("useQuestionBrowser must be used within a QuestionBrowserProvider");
  }
  return context;
}
