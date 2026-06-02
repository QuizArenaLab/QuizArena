"use client";

/**
 * QuizArena — Question Card Component
 *
 * Renders the current question with options in competitive-exam style.
 * Keyboard navigation: 1-4 for options, ← → for nav.
 */

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ExamQuestion } from "@/types/exam";

interface QuestionCardProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelectOption: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmitRequest: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  onSubmitRequest,
}: QuestionCardProps) {
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Arrow keys for navigation
      if (e.key === "ArrowRight" && !isLast) {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        onPrevious();
        return;
      }

      // Number keys 1-4 for option selection
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= question.options.length) {
        e.preventDefault();
        const option = question.options[numKey - 1];
        if (option) {
          onSelectOption(question.questionId, option.id);
        }
      }
    },
    [question, isFirst, isLast, onNext, onPrevious, onSelectOption]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
      {/* Question Header */}
      <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-medium text-slate-400">
          Question <span className="text-white font-bold">{questionNumber}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span className="text-slate-500">{totalQuestions}</span>
        </h2>
        <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider rounded-md">
          Single Choice
        </span>
      </div>

      {/* Question Text */}
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-xl sm:text-2xl leading-relaxed font-medium text-slate-100">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(question.questionId, option.id)}
              className={cn(
                "exam-option w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 group",
                isSelected
                  ? "bg-blue-600/10 border-blue-500/70 text-blue-50 ring-1 ring-blue-500/30"
                  : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600 text-slate-300"
              )}
              aria-pressed={isSelected}
            >
              <div
                className={cn(
                  "shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-150",
                  isSelected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-slate-600 text-slate-400 group-hover:border-slate-500"
                )}
              >
                {option.displayLabel}
              </div>
              <span className="text-base sm:text-lg leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 sm:px-8 sm:py-5 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
            isFirst
              ? "opacity-40 cursor-not-allowed text-slate-500"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-[0.97]"
          )}
          aria-label="Previous question"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Keyboard hint */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">←</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">→</span>
          <span>Navigate</span>
          <span className="mx-1 text-slate-700">·</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">1-4</span>
          <span>Select</span>
        </div>

        {isLast ? (
          <button
            onClick={onSubmitRequest}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.97]"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.97]"
            aria-label="Next question"
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
