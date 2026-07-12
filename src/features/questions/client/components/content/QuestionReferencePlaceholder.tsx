import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionReferencePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionReferencePlaceholder: React.FC<QuestionReferencePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-reference-placeholder",
      name: "QuestionReferencePlaceholder",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
