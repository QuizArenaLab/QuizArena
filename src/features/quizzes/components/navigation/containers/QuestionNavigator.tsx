import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionNavigatorProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-navigator",
      name: "QuestionNavigator",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
