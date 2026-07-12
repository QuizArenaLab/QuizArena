import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionDividerProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionDivider: React.FC<QuestionDividerProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-divider",
      name: "QuestionDivider",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
