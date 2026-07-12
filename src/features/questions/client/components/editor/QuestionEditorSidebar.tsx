import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorSidebar: React.FC<QuestionEditorSidebarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-sidebar",
      name: "QuestionEditorSidebar",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
