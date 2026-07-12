import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardStatusProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionCardStatus: React.FC<QuestionCardStatusProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-status",
      name: "QuestionCardStatus",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
