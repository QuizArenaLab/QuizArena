import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorStatusProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorStatus: React.FC<QuestionEditorStatusProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-status",
      name: "QuestionEditorStatus",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
