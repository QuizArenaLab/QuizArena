import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionPlaceholder: React.FC<QuestionOptionPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-placeholder",
      name: "QuestionOptionPlaceholder",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
