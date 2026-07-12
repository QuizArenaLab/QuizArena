import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionVideoPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionVideoPlaceholder: React.FC<QuestionVideoPlaceholderProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-video-placeholder",
      name: "QuestionVideoPlaceholder",
      category: "question",
      subtype: "media",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
