import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationBody: React.FC<QuizNavigationBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-body",
      name: "QuizNavigationBody",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
