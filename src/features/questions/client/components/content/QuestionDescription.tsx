import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionDescriptionProps {
  description: string;
  className?: string;
}

export function QuestionDescription({ description, className = "" }: QuestionDescriptionProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-description",
      name: "QuestionDescription",
      category: "question",
      subtype: "content",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return <p className={`text-sm text-muted-foreground line-clamp-3 ${className}`}>{description}</p>;
}
