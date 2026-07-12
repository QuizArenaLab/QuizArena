import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface EditorSplitLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const EditorSplitLayout: React.FC<EditorSplitLayoutProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "editor-split-layout",
      name: "EditorSplitLayout",
      category: "question",
      subtype: "editor-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
