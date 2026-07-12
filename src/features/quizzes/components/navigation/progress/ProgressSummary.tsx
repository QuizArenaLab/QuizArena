import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProgressSummaryProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "progress-summary",
      name: "ProgressSummary",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
