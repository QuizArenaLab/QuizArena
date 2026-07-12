import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionExplanationPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionExplanationPlaceholder: React.FC<QuestionExplanationPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-explanation-placeholder",
      name: "QuestionExplanationPlaceholder",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
