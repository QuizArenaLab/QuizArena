"use client";

import { IntelligenceInsight } from '@/lib/intelligence-engine';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";

interface DeterministicInsightsProps {
  insights: IntelligenceInsight[];
}

export function DeterministicInsights({ insights }: DeterministicInsightsProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A1C40] uppercase tracking-wider mb-2">
          Performance Insights
        </h3>
        <p className="text-sm text-gray-500">
          Gathering competitive data. Complete more challenges to unlock deterministic insights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-bold text-[#0A1C40] uppercase tracking-wider">
          Analytical Insights
        </h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          let Icon = Activity;
          let colorClass = "text-gray-600 bg-gray-50 border-gray-200";

          switch (insight.type) {
            case "STRENGTH":
              Icon = TrendingUp;
              colorClass = "text-green-700 bg-green-50 border-green-200";
              break;
            case "WEAKNESS":
              Icon = TrendingDown;
              colorClass = "text-red-700 bg-red-50 border-red-200";
              break;
            case "DISCIPLINE":
              Icon = AlertCircle;
              colorClass = "text-amber-700 bg-amber-50 border-amber-200";
              break;
          }

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border flex items-start gap-4 transition-colors ${colorClass}`}
            >
              <div className={`mt-0.5 shrink-0 ${colorClass.split(" ")[0]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">{insight.message}</p>
                {insight.metric && (
                  <span className="inline-block mt-2 text-xs font-black uppercase tracking-wider px-2 py-1 rounded bg-white/50">
                    {insight.metric}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
