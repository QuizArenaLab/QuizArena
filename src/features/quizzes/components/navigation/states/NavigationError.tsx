import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationError: React.FC<NavigationErrorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-error",
      name: "NavigationError",
      category: "quiz",
      subtype: "navigation-state",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
