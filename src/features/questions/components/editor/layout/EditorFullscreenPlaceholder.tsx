import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface EditorFullscreenPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const EditorFullscreenPlaceholder: React.FC<EditorFullscreenPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "editor-fullscreen-placeholder",
      name: "EditorFullscreenPlaceholder",
      category: "question",
      subtype: "editor-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
