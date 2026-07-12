import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionLabel: React.FC<QuestionOptionLabelProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-label",
      name: "QuestionOptionLabel",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
