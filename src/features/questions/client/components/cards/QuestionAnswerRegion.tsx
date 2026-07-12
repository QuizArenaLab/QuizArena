import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionAnswerRegionProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionAnswerRegion: React.FC<QuestionAnswerRegionProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-answer-region",
      name: "QuestionAnswerRegion",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
