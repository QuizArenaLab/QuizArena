import React, { ReactNode } from "react";
import { QuestionContext, QuestionContextValue } from "../core/QuestionContext";
import { QuestionManifest } from "../core/QuestionManifest";
import { QuestionMetadata } from "../models/QuestionMetadata";

export interface QuestionProviderProps {
  manifest?: QuestionManifest;
  metadata?: QuestionMetadata;
  mode?: QuestionContextValue["mode"];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  children: ReactNode;
}

export function QuestionProvider({
  manifest,
  metadata,
  mode = "view",
  isLoading = false,
  isError = false,
  error,
  children,
}: QuestionProviderProps) {
  const contextValue: QuestionContextValue = {
    manifest,
    metadata,
    mode,
    isLoading,
    isError,
    error,
  };

  return <QuestionContext.Provider value={contextValue}>{children}</QuestionContext.Provider>;
}
