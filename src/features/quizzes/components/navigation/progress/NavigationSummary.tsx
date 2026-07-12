import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationSummaryProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationSummary: React.FC<NavigationSummaryProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-summary",
      name: "NavigationSummary",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
