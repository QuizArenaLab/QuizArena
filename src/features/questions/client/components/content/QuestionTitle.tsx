import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionTitleProps {
  title: string;
  className?: string;
}

export function QuestionTitle({ title, className = "" }: QuestionTitleProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-title",
      name: "QuestionTitle",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <h3 className={`text-lg font-semibold leading-tight line-clamp-2 text-foreground ${className}`}>
      {title}
    </h3>
  );
}
