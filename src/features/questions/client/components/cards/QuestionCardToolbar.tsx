import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionCardToolbar: React.FC<QuestionCardToolbarProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-toolbar",
      name: "QuestionCardToolbar",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
