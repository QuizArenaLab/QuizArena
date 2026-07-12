import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionsProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-options",
      name: "QuestionOptions",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
