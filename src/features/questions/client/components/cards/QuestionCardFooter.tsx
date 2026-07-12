import React, { ReactNode, useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function QuestionCardFooter({ children, className = "" }: QuestionCardFooterProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card-footer",
      name: "QuestionCardFooter",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div
      className={`p-4 md:px-6 md:py-4 bg-muted/30 border-t border-border flex items-center justify-between gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
