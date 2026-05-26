"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestionIndex,
  answers,
  questionIds,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">
        Question Navigator
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const qId = questionIds[index];
          const isAnswered = qId && !!answers[qId];
          const isCurrent = currentQuestionIndex === index;

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              className={cn(
                "h-10 w-10 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center",
                isCurrent
                  ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900"
                  : isAnswered
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
