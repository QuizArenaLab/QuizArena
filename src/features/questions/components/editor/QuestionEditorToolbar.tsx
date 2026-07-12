import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorToolbarProps {
  children?: React.ReactNode;
  className?: string;
  toolbar?: React.ReactNode;
}

export const QuestionEditorToolbar: React.FC<QuestionEditorToolbarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-toolbar",
      name: "QuestionEditorToolbar",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
