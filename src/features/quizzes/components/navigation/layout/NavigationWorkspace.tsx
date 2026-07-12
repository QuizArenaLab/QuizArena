import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationWorkspaceProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationWorkspace: React.FC<NavigationWorkspaceProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-workspace",
      name: "NavigationWorkspace",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
