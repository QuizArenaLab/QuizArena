import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationStatusBarProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationStatusBar: React.FC<NavigationStatusBarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-status-bar",
      name: "NavigationStatusBar",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
