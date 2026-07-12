import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionGroupHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionGroupHeader: React.FC<QuestionGroupHeaderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-group-header",
      name: "QuestionGroupHeader",
      category: "quiz",
      subtype: "navigation-container",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
