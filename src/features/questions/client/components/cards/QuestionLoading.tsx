import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { QuestionCard, QuestionCardHeader, QuestionCardBody, QuestionCardFooter } from "./index";

export function QuestionLoading() {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-loading",
      name: "QuestionLoading",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <QuestionCard className="animate-pulse">
      <QuestionCardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-muted rounded"></div>
      </QuestionCardHeader>
      <QuestionCardBody>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-full bg-muted rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
      </QuestionCardBody>
      <QuestionCardFooter>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-16 bg-muted rounded"></div>
      </QuestionCardFooter>
    </QuestionCard>
  );
}
