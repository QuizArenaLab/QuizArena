import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCodePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionCodePlaceholder: React.FC<QuestionCodePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-code-placeholder",
      name: "QuestionCodePlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
