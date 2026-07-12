import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionHintPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionHintPlaceholder: React.FC<QuestionHintPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-hint-placeholder",
      name: "QuestionHintPlaceholder",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
