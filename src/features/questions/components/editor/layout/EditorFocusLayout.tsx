import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface EditorFocusLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const EditorFocusLayout: React.FC<EditorFocusLayoutProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "editor-focus-layout",
      name: "EditorFocusLayout",
      category: "question",
      subtype: "editor-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
