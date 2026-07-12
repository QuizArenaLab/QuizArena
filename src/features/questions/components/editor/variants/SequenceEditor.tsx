import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SequenceEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const SequenceEditor: React.FC<SequenceEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "sequence-editor",
      name: "SequenceEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
