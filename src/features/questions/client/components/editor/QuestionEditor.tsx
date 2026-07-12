import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorProps {
  children?: React.ReactNode;
  className?: string;
  schema?: any;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor",
      name: "QuestionEditor",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
