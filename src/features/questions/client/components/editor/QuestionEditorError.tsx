import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorError: React.FC<QuestionEditorErrorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-error",
      name: "QuestionEditorError",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
