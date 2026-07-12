import React, { useReducer } from "react";
import { QuestionEditorContext } from "../editor/QuestionEditorContext";
import { QuestionEditorState } from "../editor/QuestionEditorState";
import { QuestionEditorAction } from "../editor/QuestionEditorTypes";

const initialState: QuestionEditorState = {
  mode: "EDIT",
  density: "COMFORTABLE",
  sidebarCollapsed: false,
  inspectorVisible: true,
  previewMode: false,
  readonlyMode: false,
  compareMode: false,
  activePanel: "INSPECTOR",
};

function editorReducer(
  state: QuestionEditorState,
  action: QuestionEditorAction
): QuestionEditorState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "TOGGLE_INSPECTOR":
      return { ...state, inspectorVisible: !state.inspectorVisible };
    case "SET_ACTIVE_PANEL":
      return { ...state, activePanel: action.payload };
    case "SET_DENSITY":
      return { ...state, density: action.payload };
    default:
      return state;
  }
}

export const QuestionEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <QuestionEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionEditorContext.Provider>
  );
};
