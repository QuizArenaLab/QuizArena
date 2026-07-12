import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionContentProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionContent: React.FC<QuestionOptionContentProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-content",
      name: "QuestionOptionContent",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
