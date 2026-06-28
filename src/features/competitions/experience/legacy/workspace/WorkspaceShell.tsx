"use client";

import { useEffect, useRef } from "react";
import {
  CompetitionRuntimeProvider,
  useRuntimeState,
  useMobilePaletteStore,
} from "../../../runtime/providers/CompetitionRuntimeProvider";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspacePalette } from "../palette/WorkspacePalette";
import { QuestionRenderer } from "../question-renderer/QuestionRenderer";
import type { WorkspaceInitPayload } from "@/types/competition-experience";

interface WorkspaceShellProps {
  payload: WorkspaceInitPayload;
}

function WorkspaceContent() {
  const status = useRuntimeState((s: any) => s.status);
  const questions = useRuntimeState((s: any) => s.questions);
  const { showMobilePalette, setShowMobilePalette } = useMobilePaletteStore();

  // Guard: Not initialized yet
  if (
    status === "BOOTING" ||
    status === "INITIALIZING" ||
    status === "RESTORING_SESSION" ||
    questions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <WorkspaceHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 sm:gap-8">
        {/* Main Content Area */}
        <section className="flex flex-col min-h-[500px]">
          <QuestionRenderer />
        </section>

        {/* Sidebar Palette (Desktop) */}
        <aside className="hidden lg:block sticky top-24">
          <WorkspacePalette />
        </aside>
      </main>

      {/* Mobile Palette Overlay (if active) */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowMobilePalette(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs h-full bg-slate-900 shadow-2xl border-l border-slate-800 p-4 overflow-y-auto">
            <button
              onClick={() => setShowMobilePalette(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 rounded-lg"
            >
              Close
            </button>
            <div className="mt-12">
              <WorkspacePalette />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkspaceShell({ payload }: WorkspaceShellProps) {
  return (
    <CompetitionRuntimeProvider payload={payload}>
      <WorkspaceContent />
    </CompetitionRuntimeProvider>
  );
}
