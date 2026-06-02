"use client";

import { BarChart3, TrendingUp, Users } from "lucide-react";

// Mock analytics for the MVP dashboard.
// In a production system, this would fetch from the analytics engine.
export function FeatureAnalyticsPanel() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-200">Rollout Telemetry</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-300">Global Exposure</span>
              </div>
              <span className="text-xs font-bold text-slate-200">24,592 Users</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 text-right">
              65% active platform adoption
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-300">
                  Staged Progression (7 Days)
                </span>
              </div>
              <span className="text-xs font-bold text-slate-200">+12% Exposure</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-slate-700" style={{ width: "30%" }} />
              <div className="h-full bg-purple-500" style={{ width: "12%" }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 text-right">
              Steady expansion curve detected
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
            <div>
              <p className="text-xs font-bold text-slate-300">System Stability</p>
              <p className="text-[10px] text-slate-500">No rollout-induced crashes</p>
            </div>
            <span className="px-2 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded text-[10px] font-bold tracking-wider uppercase">
              Stable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
