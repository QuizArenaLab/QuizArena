import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionOptionImagePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionOptionImagePlaceholder: React.FC<QuestionOptionImagePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-option-image-placeholder",
      name: "QuestionOptionImagePlaceholder",
      category: "question",
      subtype: "option",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
