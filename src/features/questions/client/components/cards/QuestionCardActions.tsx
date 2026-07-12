import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardActionsProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionCardActions: React.FC<QuestionCardActionsProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-actions",
      name: "QuestionCardActions",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
