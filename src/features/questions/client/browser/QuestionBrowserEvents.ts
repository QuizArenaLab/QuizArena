import { QuestionBrowserMode } from "./QuestionBrowserMode";
import { QuestionBrowserView } from "./QuestionBrowserView";

export type QuestionBrowserEventType =
  | "ModeChanged"
  | "ViewChanged"
  | "SelectionChanged"
  | "ComparisonChanged"
  | "PreviewOpened"
  | "PreviewClosed"
  | "ActionClicked";

export interface QuestionBrowserEventPayloads {
  ModeChanged: { mode: QuestionBrowserMode; timestamp: number };
  ViewChanged: { view: QuestionBrowserView; timestamp: number };
  SelectionChanged: {
    selectedIds: Set<string>;
    added?: string;
    removed?: string;
    timestamp: number;
  };
  ComparisonChanged: { comparisonIds: Set<string>; timestamp: number };
  PreviewOpened: { questionId: string; timestamp: number };
  PreviewClosed: { timestamp: number };
  ActionClicked: { actionId: string; timestamp: number };
}
