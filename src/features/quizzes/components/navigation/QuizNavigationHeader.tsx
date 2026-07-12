import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationHeader: React.FC<QuizNavigationHeaderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-header",
      name: "QuizNavigationHeader",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
