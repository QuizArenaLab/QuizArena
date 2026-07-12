import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CodingEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const CodingEditor: React.FC<CodingEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "coding-editor",
      name: "CodingEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
