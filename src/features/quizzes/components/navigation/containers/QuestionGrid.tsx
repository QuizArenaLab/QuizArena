import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionGridProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-grid",
      name: "QuestionGrid",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
