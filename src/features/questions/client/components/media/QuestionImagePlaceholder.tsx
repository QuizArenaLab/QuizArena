import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionImagePlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionImagePlaceholder: React.FC<QuestionImagePlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-image-placeholder",
      name: "QuestionImagePlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
