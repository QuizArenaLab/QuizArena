import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationViewportProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationViewport: React.FC<NavigationViewportProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-viewport",
      name: "NavigationViewport",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
