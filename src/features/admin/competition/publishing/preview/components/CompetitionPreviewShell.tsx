"use client";

import { useState } from "react";
import { PreviewBanner } from "./PreviewBanner";
import { CompetitionWithRelations } from "../../../types";

interface CompetitionPreviewShellProps {
  competition: CompetitionWithRelations;
}

export function CompetitionPreviewShell({ competition }: CompetitionPreviewShellProps) {
  const [activeView, setActiveView] = useState<"landing" | "exam">("landing");

  // We mock ExamInitData to feed into the ExamShell
  // The ExamShell component requires a lot of real context (timer, store) which might break if we just render it.
  // Ideally, ExamShell takes an optional `previewMode` prop to disable API calls/mutations.
  // Since we are not modifying ExamShell right now, we will render a static mock or use the ChallengePreviewModal.

  return (
    <div className="flex flex-col h-full bg-white relative">
      <PreviewBanner />

      <div className="flex bg-gray-100 border-b border-gray-200 p-2 gap-2 justify-center">
        <button
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeView === "landing" ? "bg-navy text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
          onClick={() => setActiveView("landing")}
        >
          Landing Page
        </button>
        <button
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeView === "exam" ? "bg-navy text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
          onClick={() => setActiveView("exam")}
        >
          Exam Environment
        </button>
      </div>

      <div className="flex-1 overflow-auto relative">
        {activeView === "landing" && (
          <div className="relative w-full h-full min-h-[600px] bg-slate-50 flex items-center justify-center p-8">
            <div className="p-8 bg-white border border-gray-200 rounded-xl">
              <h2 className="text-2xl font-bold">{competition.title}</h2>
              <p>Preview Landing Page Mock</p>
            </div>
          </div>
        )}

        {activeView === "exam" && (
          <div className="w-full h-full min-h-[800px] bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <p className="text-xl font-bold text-white mb-2">Exam Environment Preview</p>
            <p className="max-w-md text-center">
              To fully render the live ExamShell in preview mode, we need to adapt the ExamShell and
              useExamStore to accept a `previewMode` flag to prevent actual API submissions and
              timer starting. This is a read-only representation.
            </p>

            {/* Note: Actually rendering ExamShell here without previewMode = true will trigger useExamStore initialization and API calls. */}
            <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-4xl opacity-50 pointer-events-none">
              <div className="h-16 border-b border-slate-800 flex items-center justify-between mb-8">
                <div className="w-48 h-6 bg-slate-800 rounded"></div>
                <div className="w-32 h-8 bg-slate-800 rounded"></div>
              </div>
              <div className="grid grid-cols-[1fr_300px] gap-8 h-96">
                <div className="bg-slate-800 rounded-xl"></div>
                <div className="bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
