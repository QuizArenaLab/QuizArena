import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MCQEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const MCQEditor: React.FC<MCQEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "mcqeditor",
      name: "MCQEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
