import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface PreviewToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "preview-toolbar",
      name: "PreviewToolbar",
      category: "question",
      subtype: "editor-preview",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
