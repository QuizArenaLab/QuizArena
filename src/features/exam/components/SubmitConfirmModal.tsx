"use client";

/**
 * QuizArena — Submit Confirmation Modal
 *
 * Final submit confirmation with unanswered question warning.
 * Prevents double-submit. Must explicitly cancel or confirm.
 */

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, Loader2 } from "lucide-react";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReviewUnanswered: () => void;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  isSubmitting: boolean;
}

export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onReviewUnanswered,
  totalQuestions,
  answeredCount,
  unansweredCount,
  isSubmitting,
}: SubmitConfirmModalProps) {
  const handleConfirm = useCallback(() => {
    if (isSubmitting) return;
    onConfirm();
  }, [isSubmitting, onConfirm]);

  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;
  const allAnswered = unansweredCount === 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop — does NOT close on click (explicit action required) */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div className="exam-modal relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {hasUnanswered ? (
            <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center mb-2">
          {isSubmitting ? "Submitting Exam..." : "Submit Exam?"}
        </h2>

        {/* Summary */}
        <p className="text-sm text-slate-400 text-center mb-6">
          This action is irreversible. Your answers will be submitted for evaluation.
        </p>

        {/* Stats */}
        <div className="bg-slate-800/60 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Questions</span>
            <span className="font-semibold text-slate-200">{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Answered</span>
            <span className="font-semibold text-emerald-400">{answeredCount}</span>
          </div>
          {hasUnanswered && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Unanswered</span>
              <span className="font-semibold text-amber-400">{unansweredCount}</span>
            </div>
          )}
        </div>

        {/* Unanswered Warning */}
        {hasUnanswered && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300">
                You have <strong className="text-amber-200">{unansweredCount} unanswered</strong>{" "}
                {unansweredCount === 1 ? "question" : "questions"}. Unanswered questions will be
                scored as 0.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Confirm Submit */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200",
              isSubmitting
                ? "bg-blue-600/50 text-blue-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Confirm Submit
              </>
            )}
          </button>

          {/* Review Unanswered */}
          {hasUnanswered && !isSubmitting && (
            <button
              onClick={onReviewUnanswered}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl font-medium text-sm transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Review Unanswered
            </button>
          )}

          {/* Cancel */}
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-slate-400 hover:text-slate-300 rounded-xl font-medium text-sm transition-colors"
            >
              Continue Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
