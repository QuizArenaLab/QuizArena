import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface InspectorStatisticsProps {
  children?: React.ReactNode;
  className?: string;
}

export const InspectorStatistics: React.FC<InspectorStatisticsProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "inspector-statistics",
      name: "InspectorStatistics",
      category: "question",
      subtype: "authoring-inspector",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
