import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorCommentsPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorCommentsPlaceholder: React.FC<InspectorCommentsPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-comments-placeholder",
      name: "InspectorCommentsPlaceholder",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
