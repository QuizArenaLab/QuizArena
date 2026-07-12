import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationReadonlyProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationReadonly: React.FC<NavigationReadonlyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-readonly",
      name: "NavigationReadonly",
      category: "quiz",
      subtype: "navigation-state",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
