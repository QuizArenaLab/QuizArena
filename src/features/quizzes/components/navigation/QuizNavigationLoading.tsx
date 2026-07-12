import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuizNavigationLoadingProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuizNavigationLoading: React.FC<QuizNavigationLoadingProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "quiz-navigation-loading",
      name: "QuizNavigationLoading",
      category: "quiz",
      subtype: "navigation",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
