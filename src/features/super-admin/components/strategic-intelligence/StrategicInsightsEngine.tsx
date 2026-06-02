"use client";

import { StrategicInsight } from "@/types/super-admin-strategic";
import { BrainCircuit, ArrowRight, Zap, Target, LineChart, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface StrategicInsightsEngineProps {
  insights: StrategicInsight[];
}

export function StrategicInsightsEngine({ insights }: StrategicInsightsEngineProps) {
  const getCategoryIcon = (category: StrategicInsight["category"]) => {
    switch (category) {
      case "RETENTION":
        return Target;
      case "ENGAGEMENT":
        return Zap;
      case "MONETIZATION":
        return LineChart;
      case "OPERATIONAL":
        return AlertTriangle;
    }
  };

  const getSeverityColors = (severity: StrategicInsight["severity"]) => {
    switch (severity) {
      case "POSITIVE":
        return "border-emerald-500/30 bg-emerald-950/20 text-emerald-400";
      case "WARNING":
        return "border-amber-500/30 bg-amber-950/20 text-amber-400";
      case "CRITICAL":
        return "border-rose-500/30 bg-rose-950/20 text-rose-400";
      default:
        return "border-slate-700 bg-slate-800/50 text-slate-300";
    }
  };

  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/50 flex items-center justify-center border border-indigo-900/50">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
              AI Strategic Insights
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">Live Engine</span>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        {insights.map((insight) => {
          const Icon = getCategoryIcon(insight.category);
          const colorClass = getSeverityColors(insight.severity);

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${colorClass} transition-colors group`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed mb-3">
                    &quot;{insight.content}&quot;
                  </p>

                  <Link
                    href={insight.recommendedWorkflowHref}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity"
                  >
                    Action: {insight.recommendedWorkflowName}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
            <BrainCircuit className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">No active strategic anomalies detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
