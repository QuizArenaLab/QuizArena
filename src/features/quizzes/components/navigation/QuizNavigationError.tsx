import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationError: React.FC<QuizNavigationErrorProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-error",
      name: "QuizNavigationError",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
