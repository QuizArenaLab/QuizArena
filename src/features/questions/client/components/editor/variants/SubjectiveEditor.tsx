import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SubjectiveEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const SubjectiveEditor: React.FC<SubjectiveEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "subjective-editor",
      name: "SubjectiveEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
