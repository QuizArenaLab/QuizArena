import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationToolbar: React.FC<QuizNavigationToolbarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-toolbar",
      name: "QuizNavigationToolbar",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
