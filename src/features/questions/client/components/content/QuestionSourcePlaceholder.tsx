import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionSourcePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionSourcePlaceholder: React.FC<QuestionSourcePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-source-placeholder",
      name: "QuestionSourcePlaceholder",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
