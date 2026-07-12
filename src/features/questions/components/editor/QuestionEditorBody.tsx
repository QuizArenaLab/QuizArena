import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorBody: React.FC<QuestionEditorBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-body",
      name: "QuestionEditorBody",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
