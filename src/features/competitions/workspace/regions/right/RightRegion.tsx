"use client";

import { useRuntimeState, useRuntimeCommand } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { WorkspaceConfiguration } from "../../types/workspace.types";
import { Flag, Check, Circle } from "lucide-react";
import { useMemo } from "react";

interface RightRegionProps {
  config: WorkspaceConfiguration;
}

export function RightRegion({ config }: RightRegionProps) {
  if (!config.showPalette) return null;

  const questions = useRuntimeState((s: any) => s.questions);
  const currentIndex = useRuntimeState((s: any) => s.currentIndex);
  const answers = useRuntimeState((s: any) => s.answers);
  const visitedMap = useRuntimeState((s: any) => s.visitedMap);
  const reviewMap = useRuntimeState((s: any) => s.reviewMap);
  const status = useRuntimeState((s: any) => s.status);

  const { dispatch } = useRuntimeCommand();
  const isSubmitting = status === "SUBMITTING" || status === "SUBMITTED";

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, { title: string; indices: number[] }>();
    questions.forEach((q: any, i: number) => {
      const secId = q.sectionId || "default";
      if (!map.has(secId)) {
        map.set(secId, { title: q.sectionTitle || "Questions", indices: [] });
      }
      map.get(secId)!.indices.push(i);
    });
    return Array.from(map.values());
  }, [questions]);

  // Global counts for legend
  let answered = 0;
  let marked = 0;
  let unvisited = 0;
  let visitedNotAnswered = 0;

  questions.forEach((q: any) => {
    const id = q.questionId;
    const hasAnswer = !!answers[id];
    const isVisited = visitedMap[id];
    const isMarked = reviewMap[id];

    if (hasAnswer) answered++;
    if (isMarked) marked++;
    if (!isVisited) unvisited++;
    if (isVisited && !hasAnswer) visitedNotAnswered++;
  });

  const jumpToQuestion = (index: number) => {
    if (isSubmitting) return;
    dispatch("NavigateQuestion", { index });
  };

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-slate-900 border-l border-slate-800 shrink-0">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80">
        <h2 className="text-sm font-bold text-white mb-3">Question Palette</h2>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-500"><Check className="w-3 h-3" /></div>
            Answered ({answered})
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500"><Flag className="w-3 h-3" /></div>
            Marked ({marked})
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500"><Circle className="w-2 h-2 fill-current" /></div>
            Not Answered ({visitedNotAnswered})
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
            Unvisited ({unvisited})
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            {sections.length > 1 && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <div className="grid grid-cols-5 gap-2">
              {section.indices.map((i) => {
                const q = questions[i];
                const id = q.questionId;
                const hasAnswer = !!answers[id];
                const isVisited = visitedMap[id];
                const isMarked = reviewMap[id];
                const isCurrent = currentIndex === i;

                let baseStyles = "relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ";

                if (isCurrent) {
                  baseStyles += "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 ";
                }

                if (isMarked) {
                  baseStyles += "bg-amber-500/20 text-amber-500 border border-amber-500 hover:bg-amber-500/30";
                } else if (hasAnswer) {
                  baseStyles += "bg-emerald-500/20 text-emerald-500 border border-emerald-500 hover:bg-emerald-500/30";
                } else if (isVisited) {
                  baseStyles += "bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30";
                } else {
                  baseStyles += "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white";
                }

                return (
                  <button
                    key={id}
                    onClick={() => jumpToQuestion(i)}
                    disabled={isSubmitting}
                    className={baseStyles}
                  >
                    {i + 1}
                    {isMarked && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
