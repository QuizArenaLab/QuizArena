import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationLegendProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationLegend: React.FC<NavigationLegendProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-legend",
      name: "NavigationLegend",
      category: "quiz",
      subtype: "navigation-progress",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
