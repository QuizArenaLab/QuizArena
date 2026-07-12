import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionTablePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionTablePlaceholder: React.FC<QuestionTablePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-table-placeholder",
      name: "QuestionTablePlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
