import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionStatisticsPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionStatisticsPlaceholder: React.FC<QuestionStatisticsPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-statistics-placeholder",
      name: "QuestionStatisticsPlaceholder",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
