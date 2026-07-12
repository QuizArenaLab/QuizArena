import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface FlagBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const FlagBadge: React.FC<FlagBadgeProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "flag-badge",
      name: "FlagBadge",
      category: "quiz",
      subtype: "navigation-tile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
