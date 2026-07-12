import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorEmpty: React.FC<QuestionEditorEmptyProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-empty",
      name: "QuestionEditorEmpty",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
