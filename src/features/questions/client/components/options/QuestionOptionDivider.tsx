import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionDividerProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionDivider: React.FC<QuestionOptionDividerProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-divider",
      name: "QuestionOptionDivider",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
