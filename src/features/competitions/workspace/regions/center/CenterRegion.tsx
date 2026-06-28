"use client";

import { useRuntimeState } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { QuestionRenderer } from "../../renderer/QuestionRenderer";
import { Flag } from "lucide-react";

export function CenterRegion() {
  const currentIndex = useRuntimeState((s: any) => s.currentIndex);
  const questions = useRuntimeState((s: any) => s.questions);
  const reviewMap = useRuntimeState((s: any) => s.reviewMap);

  const question = questions[currentIndex];
  const isMarked = question ? reviewMap[question.questionId] : false;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Optional: Question Header / Context Ribbon */}
      <div className="px-6 py-3 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
            {currentIndex + 1}
          </span>
          <span className="text-slate-400 text-sm font-medium">of {questions.length}</span>
        </div>
        
        {isMarked && (
          <span className="text-amber-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
            <Flag className="w-3 h-3 fill-current" />
            Marked
          </span>
        )}
      </div>

      {/* Main renderer container */}
      <div className="flex-1 overflow-y-auto">
        <QuestionRenderer />
      </div>
    </div>
  );
}
