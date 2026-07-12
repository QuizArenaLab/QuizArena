import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NumericalEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const NumericalEditor: React.FC<NumericalEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "numerical-editor",
      name: "NumericalEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
