import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorAIPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorAIPlaceholder: React.FC<InspectorAIPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-aiplaceholder",
      name: "InspectorAIPlaceholder",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
