import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SuggestionPanelProps {
  children?: React.ReactNode;
  className?: string;
}

export const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "suggestion-panel",
      name: "SuggestionPanel",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
