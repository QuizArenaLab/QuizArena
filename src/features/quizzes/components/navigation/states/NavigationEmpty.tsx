import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationEmpty: React.FC<NavigationEmptyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-empty",
      name: "NavigationEmpty",
      category: "quiz",
      subtype: "navigation-state",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
