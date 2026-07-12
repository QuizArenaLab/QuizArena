import React, { ReactNode, useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function QuestionCard({ children, className = "", onClick }: QuestionCardProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-card",
      name: "QuestionCard",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div
      className={`bg-card text-card-foreground border border-border rounded-xl shadow-sm overflow-hidden flex flex-col ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
