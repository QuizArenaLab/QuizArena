import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorPlaceholder: React.FC<QuestionEditorPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-placeholder",
      name: "QuestionEditorPlaceholder",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
