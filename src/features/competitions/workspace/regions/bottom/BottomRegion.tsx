"use client";

import { useRuntimeState, useRuntimeCommand } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { WorkspaceConfiguration } from "../../types/workspace.types";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";

interface BottomRegionProps {
  config: WorkspaceConfiguration;
}

export function BottomRegion({ config }: BottomRegionProps) {
  const questions = useRuntimeState((s: any) => s.questions);
  const currentIndex = useRuntimeState((s: any) => s.currentIndex);
  const reviewMap = useRuntimeState((s: any) => s.reviewMap);
  const status = useRuntimeState((s: any) => s.status);

  const { dispatch } = useRuntimeCommand();

  const isSubmitting = status === "SUBMITTING" || status === "SUBMITTED";
  const question = questions[currentIndex];
  const isMarked = question ? reviewMap[question.questionId] : false;

  const toggleReviewMark = () => {
    if (isSubmitting || !question || !config.allowReviewMark) return;
    dispatch("ToggleReviewMark", { questionId: question.questionId });
  };

  const goPrevious = () => {
    if (currentIndex > 0 && !isSubmitting && config.allowPreviousNavigation) {
      dispatch("NavigateQuestion", { index: currentIndex - 1 });
    }
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1 && !isSubmitting) {
      dispatch("NavigateQuestion", { index: currentIndex + 1 });
    }
  };

  return (
    <div className="h-16 px-6 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0 || isSubmitting || !config.allowPreviousNavigation}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {config.allowReviewMark && (
          <button
            onClick={toggleReviewMark}
            disabled={isSubmitting}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isMarked
                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Flag className={`w-4 h-4 ${isMarked ? "fill-current" : ""}`} />
            {isMarked ? "Marked for Review" : "Mark for Review"}
          </button>
        )}
      </div>

      <button
        onClick={goNext}
        disabled={currentIndex === questions.length - 1 || isSubmitting}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
