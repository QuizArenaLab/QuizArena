import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationEmpty: React.FC<QuizNavigationEmptyProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-empty",
      name: "QuizNavigationEmpty",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
