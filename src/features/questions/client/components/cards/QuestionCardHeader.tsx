import React, { ReactNode, useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function QuestionCardHeader({ children, className = "" }: QuestionCardHeaderProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-header",
      name: "QuestionCardHeader",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div className={`p-4 md:p-6 border-b border-border flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  );
}
