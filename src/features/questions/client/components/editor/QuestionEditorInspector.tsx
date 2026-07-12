import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorInspectorProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorInspector: React.FC<QuestionEditorInspectorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-inspector",
      name: "QuestionEditorInspector",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
