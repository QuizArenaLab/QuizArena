import React, { ReactNode, useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardBodyProps {
  children: ReactNode;
  className?: string;
}

export function QuestionCardBody({ children, className = "" }: QuestionCardBodyProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-body",
      name: "QuestionCardBody",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <div className={`p-4 md:p-6 flex-1 flex flex-col gap-4 ${className}`}>{children}</div>;
}
