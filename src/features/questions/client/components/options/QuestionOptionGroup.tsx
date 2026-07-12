import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionGroupProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionGroup: React.FC<QuestionOptionGroupProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-group",
      name: "QuestionOptionGroup",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
