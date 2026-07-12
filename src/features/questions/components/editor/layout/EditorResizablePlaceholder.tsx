import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface EditorResizablePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const EditorResizablePlaceholder: React.FC<EditorResizablePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "editor-resizable-placeholder",
      name: "EditorResizablePlaceholder",
      category: "question",
      subtype: "editor-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
