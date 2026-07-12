import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionStatementProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionStatement: React.FC<QuestionStatementProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-statement",
      name: "QuestionStatement",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
