import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons";

export interface QuestionEmptyProps {
  message?: string;
}

export function QuestionEmpty({ message = "No questions found" }: QuestionEmptyProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-empty",
      name: "QuestionEmpty",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border border-dashed rounded-xl">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon name="Inbox" className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your filters or creating a new question.
      </p>
    </div>
  );
}
