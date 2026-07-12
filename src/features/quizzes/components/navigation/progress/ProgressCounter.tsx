import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ProgressCounterProps {
  children?: React.ReactNode;
  className?: string;
}

export const ProgressCounter: React.FC<ProgressCounterProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "progress-counter",
      name: "ProgressCounter",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
