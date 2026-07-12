import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionInstructionProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionInstruction: React.FC<QuestionInstructionProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-instruction",
      name: "QuestionInstruction",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
