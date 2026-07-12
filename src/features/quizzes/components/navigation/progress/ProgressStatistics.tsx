import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProgressStatisticsProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProgressStatistics: React.FC<ProgressStatisticsProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "progress-statistics",
      name: "ProgressStatistics",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
