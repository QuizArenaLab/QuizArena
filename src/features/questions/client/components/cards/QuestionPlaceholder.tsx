import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { QuestionCard, QuestionCardHeader, QuestionCardBody, QuestionCardFooter } from "./index";

export function QuestionPlaceholder() {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-placeholder",
      name: "QuestionPlaceholder",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <QuestionCard className="border-dashed border-2 opacity-60">
      <QuestionCardHeader className="bg-muted/30">
        <div className="h-5 w-1/3 bg-muted rounded"></div>
      </QuestionCardHeader>
      <QuestionCardBody>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
          Select or add a question to preview
        </div>
      </QuestionCardBody>
      <QuestionCardFooter>
        <div className="h-4 w-1/4 bg-muted rounded"></div>
      </QuestionCardFooter>
    </QuestionCard>
  );
}
