import React from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Info, AlertCircle } from "lucide-react";
import type { QuestionIntelligence } from "@/features/admin/services/question-bank/usage-intelligence";

interface Props {
  intelligence: QuestionIntelligence;
  configuredDifficulty: string;
  onDismissRecommendation?: (type: string) => void;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "UP") return <TrendingUp className="w-4 h-4 text-green-500 inline mr-1" />;
  if (trend === "DOWN") return <TrendingDown className="w-4 h-4 text-red-500 inline mr-1" />;
  return <Minus className="w-4 h-4 text-gray-500 inline mr-1" />;
}

export function UsageIntelligencePanel({
  intelligence,
  configuredDifficulty,
  onDismissRecommendation,
}: Props) {
  const { usageStats, dynamicFlags, recommendations, insufficientData } = intelligence;

  if (insufficientData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
          Usage Intelligence
        </h3>
        <p className="text-sm text-gray-500 mb-4">Operational metrics based on user attempts</p>
        <div className="flex items-center text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <Info className="w-5 h-5 mr-2" />
          <p className="text-sm">
            Insufficient Data: Need at least 50 attempts to generate intelligence insights. Current
            attempts: {usageStats.timesAttempted}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
        Usage Intelligence
      </h3>
      <p className="text-sm text-gray-500 mb-6">Operational metrics and insights</p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Success Rate
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {(usageStats.successRate * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendIcon trend={usageStats.successRateTrend} /> Trend
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Attempts
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {usageStats.timesAttempted.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendIcon trend={usageStats.attemptsTrend} /> Trend
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Avg Time Spent
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {usageStats.averageTimeSpent.toFixed(1)}s
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Skip Rate
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {usageStats.timesAttempted > 0
                ? ((usageStats.skippedAttempts / usageStats.timesAttempted) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              Configured Difficulty
            </p>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
              {configuredDifficulty}
            </span>
          </div>
          {usageStats.actualDifficulty !== configuredDifficulty ? (
            <AlertTriangle className="w-6 h-6 text-orange-500 mx-4" />
          ) : (
            <Minus className="w-6 h-6 text-indigo-300 mx-4" />
          )}
          <div className="text-right">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              Actual Difficulty
            </p>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${usageStats.actualDifficulty !== configuredDifficulty ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-indigo-200 text-indigo-700"}`}
            >
              {usageStats.actualDifficulty || "N/A"}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
            Active Intelligence Flags
          </h4>
          <div className="flex flex-wrap gap-2">
            {dynamicFlags.map((flag) => (
              <span
                key={flag}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${flag === "HEALTHY" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
              >
                {flag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              Automated Recommendations
            </h4>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.type}
                  className="flex items-start justify-between bg-blue-50 p-4 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-0.5">
                        {rec.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-blue-700">{rec.message}</p>
                    </div>
                  </div>
                  {onDismissRecommendation && (
                    <button
                      onClick={() => onDismissRecommendation(rec.type)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors ml-4 shrink-0"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
