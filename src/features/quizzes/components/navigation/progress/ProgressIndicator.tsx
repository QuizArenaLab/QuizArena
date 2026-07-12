import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProgressIndicatorProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "progress-indicator",
      name: "ProgressIndicator",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
