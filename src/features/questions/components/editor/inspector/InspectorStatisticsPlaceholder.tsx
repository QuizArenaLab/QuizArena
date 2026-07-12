import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorStatisticsPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorStatisticsPlaceholder: React.FC<InspectorStatisticsPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-statistics-placeholder",
      name: "InspectorStatisticsPlaceholder",
      category: "question",
      subtype: "editor-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
