import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionMathPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionMathPlaceholder: React.FC<QuestionMathPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-math-placeholder",
      name: "QuestionMathPlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
