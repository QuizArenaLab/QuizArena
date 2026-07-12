import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorHistoryPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorHistoryPlaceholder: React.FC<InspectorHistoryPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-history-placeholder",
      name: "InspectorHistoryPlaceholder",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
