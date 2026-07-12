import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface CaseStudyEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const CaseStudyEditor: React.FC<CaseStudyEditorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "case-study-editor",
      name: "CaseStudyEditor",
      category: "question",
      subtype: "editor-variant",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
