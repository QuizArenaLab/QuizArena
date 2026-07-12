import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface SplitPreviewProps {
  children?: React.ReactNode;
  className?: string;
}

export const SplitPreview: React.FC<SplitPreviewProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "split-preview",
      name: "SplitPreview",
      category: "question",
      subtype: "editor-preview",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
