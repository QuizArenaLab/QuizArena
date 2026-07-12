import { createContext, useContext } from "react";
import { QuestionMetadata } from "../models/QuestionMetadata";
import { QuestionManifest } from "./QuestionManifest";

export interface QuestionContextValue {
  manifest?: QuestionManifest;
  metadata?: QuestionMetadata;
  mode: "view" | "preview" | "edit" | "compare" | "compact";
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

export const QuestionContext = createContext<QuestionContextValue | undefined>(undefined);

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
}
