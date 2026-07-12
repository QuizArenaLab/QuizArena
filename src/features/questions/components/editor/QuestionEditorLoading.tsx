import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorLoadingProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorLoading: React.FC<QuestionEditorLoadingProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-loading",
      name: "QuestionEditorLoading",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
