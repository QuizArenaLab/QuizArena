import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface ReadinessIndicatorProps {
  children?: React.ReactNode;
  className?: string;
}

export const ReadinessIndicator: React.FC<ReadinessIndicatorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "readiness-indicator",
      name: "ReadinessIndicator",
      category: "question",
      subtype: "authoring-completion",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
