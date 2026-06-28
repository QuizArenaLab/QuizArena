"use client";

import { useEffect } from "react";
import { TopRegion } from "../regions/top/TopRegion";
import { CenterRegion } from "../regions/center/CenterRegion";
import { RightRegion } from "../regions/right/RightRegion";
import { BottomRegion } from "../regions/bottom/BottomRegion";
import { OverlayRegion } from "../regions/overlay/OverlayRegion";
import { WorkspaceConfiguration } from "../types/workspace.types";
import { MonitorX } from "lucide-react";

interface WorkspaceLayoutProps {
  config: WorkspaceConfiguration;
}

export function WorkspaceLayout({ config }: WorkspaceLayoutProps) {
  // Desktop enforcement for MVP
  // Usually this would be handled with a resize listener or CSS breakpoints blocking the UI.
  // We'll use CSS to hide the workspace on mobile and show a block screen.
  
  return (
    <>
      <div className="hidden lg:flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden">
        <TopRegion config={config} />
        
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <CenterRegion />
            <BottomRegion config={config} />
          </div>
          
          <RightRegion config={config} />
        </main>

        <OverlayRegion />
      </div>

      {/* Mobile/Tablet Block Screen */}
      <div className="lg:hidden flex flex-col items-center justify-center min-h-screen bg-slate-950 text-center p-6">
        <MonitorX className="w-16 h-16 text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3">Desktop Required</h2>
        <p className="text-slate-400 max-w-sm">
          Please use a desktop or laptop computer for the best assessment experience. Mobile and small tablet devices are currently not supported for active competitions.
        </p>
      </div>
    </>
  );
}
