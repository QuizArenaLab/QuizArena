import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface MSQEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const MSQEditor: React.FC<MSQEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "msqeditor",
      name: "MSQEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
