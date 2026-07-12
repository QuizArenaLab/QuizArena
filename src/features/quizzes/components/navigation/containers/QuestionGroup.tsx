import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionGroupProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionGroup: React.FC<QuestionGroupProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-group",
      name: "QuestionGroup",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
