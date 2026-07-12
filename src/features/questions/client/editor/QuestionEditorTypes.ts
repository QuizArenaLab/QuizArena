export type QuestionEditorAction =
  | { type: "SET_MODE"; payload: any }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_INSPECTOR" }
  | { type: "SET_ACTIVE_PANEL"; payload: any }
  | { type: "SET_DENSITY"; payload: any };
