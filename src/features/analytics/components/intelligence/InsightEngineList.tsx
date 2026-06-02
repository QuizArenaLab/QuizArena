"use client";

import { ArrowRight, Brain, AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import type { IntelligenceInsight, OperationalStatus } from "@/features/analytics/services/intelligence/types";

interface InsightEngineListProps {
  insights: IntelligenceInsight[];
}

const statusIcons: Record<OperationalStatus, React.ReactNode> = {
  STABLE: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  WATCH: <Info className="w-5 h-5 text-amber-500" />,
  DECLINING: <AlertCircle className="w-5 h-5 text-orange-500" />,
  CRITICAL: <AlertTriangle className="w-5 h-5 text-rose-500" />,
};

const statusBorder: Record<OperationalStatus, string> = {
  STABLE: "border-l-emerald-500",
  WATCH: "border-l-amber-500",
  DECLINING: "border-l-orange-500",
  CRITICAL: "border-l-rose-500",
};

export function InsightEngineList({ insights }: InsightEngineListProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border/40 shadow-sm h-full flex flex-col">
        <div className="p-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" /> Intelligence Insights
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">Automated operational diagnostics.</p>
        </div>
        <div className="p-6 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Brain className="w-12 h-12 mb-4 opacity-20" />
          <p>No actionable insights generated.</p>
          <p className="text-sm">Platform is operating normally.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border/40 shadow-sm h-full flex flex-col">
      <div className="p-6 pb-4 border-b border-border/40">
        <h3 className="text-xl font-semibold flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" /> Insight Engine
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Automated operational anomalies and strategic recommendations.
        </p>
      </div>
      <div className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-lg border border-border/60 bg-muted/20 border-l-4 ${statusBorder[insight.status]} hover:bg-muted/40 transition-colors`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{statusIcons[insight.status]}</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {insight.category}
                    </span>
                    <span className="text-xs text-muted-foreground/60">•</span>
                    <span className="text-xs text-muted-foreground/60">
                      {new Date(insight.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{insight.message}</p>
                </div>
              </div>

              {insight.actionableLink && (
                <div className="sm:ml-auto pt-2 sm:pt-0">
                  <Link
                    href={insight.actionableLink}
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 h-8 px-3 w-full sm:w-auto"
                  >
                    {insight.actionableLabel ?? "Take Action"}{" "}
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
