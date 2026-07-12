import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProgressLegendProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProgressLegend: React.FC<ProgressLegendProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "progress-legend",
      name: "ProgressLegend",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
