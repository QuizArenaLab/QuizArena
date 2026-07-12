import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionStatusBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionStatusBadge: React.FC<QuestionStatusBadgeProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-status-badge",
      name: "QuestionStatusBadge",
      category: "quiz",
      subtype: "navigation-tile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
