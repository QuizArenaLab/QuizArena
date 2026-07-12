import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface FillBlankEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const FillBlankEditor: React.FC<FillBlankEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "fill-blank-editor",
      name: "FillBlankEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
