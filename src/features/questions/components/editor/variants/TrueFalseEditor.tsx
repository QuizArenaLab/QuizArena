import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface TrueFalseEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const TrueFalseEditor: React.FC<TrueFalseEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "true-false-editor",
      name: "TrueFalseEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
