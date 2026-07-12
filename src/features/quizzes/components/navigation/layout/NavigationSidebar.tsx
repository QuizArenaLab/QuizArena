import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-sidebar",
      name: "NavigationSidebar",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
