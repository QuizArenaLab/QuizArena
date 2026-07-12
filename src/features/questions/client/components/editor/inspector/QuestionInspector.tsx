import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionInspectorProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionInspector: React.FC<QuestionInspectorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-inspector",
      name: "QuestionInspector",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
