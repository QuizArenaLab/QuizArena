import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionSectionProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-section",
      name: "QuestionSection",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
