import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationPlaceholder: React.FC<NavigationPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-placeholder",
      name: "NavigationPlaceholder",
      category: "quiz",
      subtype: "navigation-state",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
