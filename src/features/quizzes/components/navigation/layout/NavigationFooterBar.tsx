import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface NavigationFooterBarProps {
  children?: React.ReactNode;
  className?: string;
}

export const NavigationFooterBar: React.FC<NavigationFooterBarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "navigation-footer-bar",
      name: "NavigationFooterBar",
      category: "quiz",
      subtype: "navigation-layout",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
