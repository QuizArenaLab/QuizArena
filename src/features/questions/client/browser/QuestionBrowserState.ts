import { QuestionBrowserMode } from "./QuestionBrowserMode";
import { QuestionBrowserView } from "./QuestionBrowserView";

export interface QuestionBrowserState {
  mode: QuestionBrowserMode;
  view: QuestionBrowserView;
  selectedIds: Set<string>;
  hoveredId: string | null;
  previewId: string | null;
  comparisonIds: Set<string>;
  loading: boolean;
  error: Error | null;
}
