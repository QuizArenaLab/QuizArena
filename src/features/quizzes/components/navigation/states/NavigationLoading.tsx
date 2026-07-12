import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationLoadingProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationLoading: React.FC<NavigationLoadingProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-loading",
      name: "NavigationLoading",
      category: "quiz",
      subtype: "navigation-state",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
