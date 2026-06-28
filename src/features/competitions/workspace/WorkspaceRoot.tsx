"use client";

import { CompetitionRuntimeProvider, useRuntimeState } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { WorkspaceLayout } from "./layout/WorkspaceLayout";
import { WorkspaceConfiguration } from "./types/workspace.types";
import { Loader2 } from "lucide-react";

interface WorkspaceRootProps {
  payload: any; // Passed from server
}

const DEFAULT_CONFIG: WorkspaceConfiguration = {
  showPalette: true,
  showTimer: true,
  showProgress: true,
  allowReviewMark: true,
  allowPreviousNavigation: true,
  requireFullscreen: false,
  timerThresholds: {
    warningSeconds: 600, // 10 mins
    criticalSeconds: 120, // 2 mins
  },
};

function WorkspaceLoader() {
  const status = useRuntimeState((s: any) => s.status);
  const questions = useRuntimeState((s: any) => s.questions);

  if (
    status === "BOOTING" ||
    status === "INITIALIZING" ||
    status === "RESTORING_SESSION" ||
    questions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Workspace Engine...</p>
      </div>
    );
  }

  // Assuming Runtime supplies configuration, but for MVP we merge with DEFAULTS
  const runtimeConfig = useRuntimeState((s: any) => s.workspaceConfig);
  const config = { ...DEFAULT_CONFIG, ...runtimeConfig };

  return <WorkspaceLayout config={config} />;
}

export function WorkspaceRoot({ payload }: WorkspaceRootProps) {
  return (
    <CompetitionRuntimeProvider payload={payload}>
      <WorkspaceLoader />
    </CompetitionRuntimeProvider>
  );
}
