import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationStatusProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationStatus: React.FC<QuizNavigationStatusProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-status",
      name: "QuizNavigationStatus",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
