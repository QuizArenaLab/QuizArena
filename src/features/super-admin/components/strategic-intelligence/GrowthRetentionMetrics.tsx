"use client";

import { LineChart, Users } from "lucide-react";

export function GrowthRetentionMetrics() {
  // In a real implementation, this would use a charting library like Recharts
  // For the sovereign UI, we will represent this with a clean, analytical skeleton

  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Growth & Retention Trajectory</h2>
          <p className="text-sm text-slate-400">Executive user acquisition & churn analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <LineChart className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-300">Live Projection</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center items-center relative min-h-[300px]">
        {/* Placeholder for actual chart */}
        <div className="absolute inset-0 flex items-end justify-between px-10 py-8 opacity-20 pointer-events-none">
          {[40, 50, 45, 60, 55, 70, 65, 80, 85, 95, 90, 100].map((h, i) => (
            <div
              key={i}
              className="w-[4%] bg-blue-500 rounded-t-sm transition-all"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="z-10 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl max-w-sm w-full text-center shadow-xl">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">Growth Curve Stable</h3>
          <p className="text-sm text-slate-400 mb-4">
            User acquisition is tracking +12% ahead of Q2 forecasts. Retention remains within
            acceptable standard deviations.
          </p>
          <div className="flex justify-between border-t border-slate-800 pt-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                MoM Growth
              </p>
              <p className="text-lg font-bold text-emerald-400">+12.4%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                90D Retention
              </p>
              <p className="text-lg font-bold text-blue-400">84.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
