import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorHeader: React.FC<QuestionEditorHeaderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-header",
      name: "QuestionEditorHeader",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
