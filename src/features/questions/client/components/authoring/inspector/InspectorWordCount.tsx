import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorWordCountProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorWordCount: React.FC<InspectorWordCountProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-word-count",
      name: "InspectorWordCount",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
