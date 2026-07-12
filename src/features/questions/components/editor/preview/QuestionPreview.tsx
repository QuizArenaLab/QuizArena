import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionPreviewProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-preview",
      name: "QuestionPreview",
      category: "question",
      subtype: "editor-preview",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
