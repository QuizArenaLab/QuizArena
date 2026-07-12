import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionPassageProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionPassage: React.FC<QuestionPassageProps> = ({ children, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-passage",
      name: "QuestionPassage",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
