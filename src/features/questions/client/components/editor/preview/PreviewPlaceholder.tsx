import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface PreviewPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "preview-placeholder",
      name: "PreviewPlaceholder",
      category: "question",
      subtype: "editor-preview",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
