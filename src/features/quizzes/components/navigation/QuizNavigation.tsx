import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation",
      name: "QuizNavigation",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
