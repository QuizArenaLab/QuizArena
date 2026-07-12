import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionEditorCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionEditorCanvas: React.FC<QuestionEditorCanvasProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-editor-canvas",
      name: "QuestionEditorCanvas",
      category: "question",
      subtype: "editor",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
