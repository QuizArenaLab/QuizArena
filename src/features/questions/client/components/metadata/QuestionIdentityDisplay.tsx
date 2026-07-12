import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionIdentityDisplayProps {
  children?: React.ReactNode;
  className?: string;
}

export const QuestionIdentityDisplay: React.FC<QuestionIdentityDisplayProps> = ({
  children,
  className,
}) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-identity-display",
      name: "QuestionIdentityDisplay",
      category: "question",
      subtype: "metadata",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={className || ""}>{children}</div>;
};
