import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionGroupBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionGroupBody: React.FC<QuestionGroupBodyProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-group-body",
      name: "QuestionGroupBody",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
