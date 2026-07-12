import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionIndexProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionIndex: React.FC<QuestionIndexProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-index",
      name: "QuestionIndex",
      category: "quiz",
      subtype: "navigation-tile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
