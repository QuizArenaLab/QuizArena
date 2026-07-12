import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons";

export interface QuestionErrorProps {
  error: Error | string;
  onRetry?: () => void;
}

export function QuestionError({ error, onRetry }: QuestionErrorProps) {
  useEffect(() => {
    ComponentRegistry.register({
      id: "question-error",
      name: "QuestionError",
      category: "question",
      subtype: "card",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-xl">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
        <Icon name="AlertCircle" className="w-5 h-5 text-red-600" />
      </div>
      <h3 className="text-base font-medium text-red-800">Failed to load question</h3>
      <p className="text-sm text-red-600 mt-1 mb-4">{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
