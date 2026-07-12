import { createContext, useContext } from "react";
import { QuestionEditorState } from "./QuestionEditorState";
import { QuestionEditorAction } from "./QuestionEditorTypes";

export interface QuestionEditorContextValue {
  state: QuestionEditorState;
  dispatch: React.Dispatch<QuestionEditorAction>;
}
export const QuestionEditorContext = createContext<QuestionEditorContextValue | null>(null);
export const useQuestionEditor = () => {
  const ctx = useContext(QuestionEditorContext);
  if (!ctx) throw new Error("useQuestionEditor must be used inside QuestionEditorProvider");
  return ctx;
};
