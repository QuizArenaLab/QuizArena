import { QuestionEditorMode } from "./QuestionEditorMode";
import { QuestionEditorPanel } from "./QuestionEditorPanel";
import { QuestionEditorDensity } from "./QuestionEditorDensity";

export interface QuestionEditorState {
  mode: QuestionEditorMode;
  activePanel?: QuestionEditorPanel;
  density: QuestionEditorDensity;
  sidebarCollapsed: boolean;
  inspectorVisible: boolean;
  previewMode: boolean;
  readonlyMode: boolean;
  compareMode: boolean;
}
