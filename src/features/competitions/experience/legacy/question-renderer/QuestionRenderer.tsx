import { useMemo } from "react";
import {
  useRuntimeState,
  useRuntimeCommand,
} from "../../../runtime/providers/CompetitionRuntimeProvider";
import { ChevronLeft, ChevronRight, Bookmark, AlertCircle, Flag } from "lucide-react";

export function QuestionRenderer() {
  const questions = useRuntimeState((s: any) => s.questions);
  const currentIndex = useRuntimeState((s: any) => s.currentIndex);
  const answers = useRuntimeState((s: any) => s.answers);
  const reviewMap = useRuntimeState((s: any) => s.reviewMap);
  const status = useRuntimeState((s: any) => s.status);

  const { dispatch } = useRuntimeCommand();

  const isSubmitting = status === "SUBMITTING" || status === "SUBMITTED";

  const question = questions[currentIndex];
  const selectedOptionId = question ? answers[question.questionId] : null;
  const isMarked = question ? reviewMap[question.questionId] : false;

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <p className="text-slate-400">Loading question...</p>
      </div>
    );
  }

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitting) return;
    dispatch("SelectAnswer", { questionId: question.questionId, optionId });
  };

  const toggleReviewMark = () => {
    if (isSubmitting) return;
    dispatch("ToggleReviewMark", { questionId: question.questionId });
  };

  const goPrevious = () => {
    if (currentIndex > 0 && !isSubmitting) {
      dispatch("NavigateQuestion", { index: currentIndex - 1 });
    }
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1 && !isSubmitting) {
      dispatch("NavigateQuestion", { index: currentIndex + 1 });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header Area */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
            {currentIndex + 1}
          </span>
          <span className="text-slate-400 text-sm font-medium">of {questions.length}</span>
        </div>

        <button
          onClick={toggleReviewMark}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isMarked
              ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <Flag className={`w-4 h-4 ${isMarked ? "fill-current" : ""}`} />
          {isMarked ? "Marked for Review" : "Mark for Review"}
        </button>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
          {question.questionText}
        </h2>

        <div className="space-y-3 max-w-3xl">
          {question.options.map((option: any) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isSubmitting}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-500/10 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 text-base leading-relaxed pt-0.5">
                  <span className="font-bold mr-2 text-slate-500">{option.displayLabel}.</span>
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === questions.length - 1 || isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
