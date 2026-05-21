"use client";

import { PlatformOverviewCard } from "./PlatformOverviewCard";
import { InsightEngineList } from "./InsightEngineList";
import { TrendCharts } from "./TrendCharts";
import type {
  OperationalIntelligenceData,
  StrategicIntelligenceData,
} from "@/lib/intelligence/types";
import { Server, Database, Activity, RefreshCw } from "lucide-react";

interface IntelligenceDashboardClientProps {
  initialData: OperationalIntelligenceData | StrategicIntelligenceData;
  isStrategic: boolean; // true if SuperAdmin viewing strategic infra data
}

export function IntelligenceDashboardClient({
  initialData,
  isStrategic,
}: IntelligenceDashboardClientProps) {
  const strategicData = isStrategic ? (initialData as StrategicIntelligenceData) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligence Center</h2>
          <p className="text-muted-foreground mt-1">
            {isStrategic
              ? "Strategic platform overview, operational insights, and infrastructure health."
              : "Operational insights, moderator workforce performance, and platform trends."}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <RefreshCw className="w-4 h-4 mr-1" />
          Updated: {new Date(initialData.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Strategic / Infra Tier (SUPER ADMIN ONLY) */}
      {isStrategic && strategicData?.system && (
        <div className="bg-muted/10 rounded-xl border border-blue-500/20 shadow-sm overflow-hidden">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-semibold flex items-center text-blue-600 dark:text-blue-400">
              <Server className="w-5 h-5 mr-2" /> Strategic Infrastructure Health
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Error Rate
                </span>
                <p className="text-2xl font-bold font-mono">{strategicData.system.errorRates}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  API Latency
                </span>
                <p className="text-2xl font-bold font-mono">{strategicData.system.apiLatency}ms</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  DB Load
                </span>
                <p className="text-2xl font-bold font-mono flex items-center">
                  <Database className="w-4 h-4 mr-1 text-muted-foreground" />{" "}
                  {strategicData.system.databaseLoad}%
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    {strategicData.system.infrastructureStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview and Insights */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <PlatformOverviewCard data={initialData.overview} />

          <div className="flex-1 min-h-[300px]">
            <InsightEngineList insights={initialData.insights} />
          </div>
        </div>

        {/* Right Column: Key Engagement/Quality stats summarizing the trends */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border/40 shadow-sm overflow-hidden">
            <div className="p-6 pb-2">
              <h3 className="text-lg font-semibold">Engagement Intelligence</h3>
              <p className="text-sm text-muted-foreground">User participation metrics</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted-foreground">
                    Active Users (7d)
                  </span>
                  <span className="text-2xl font-bold">
                    {initialData.engagement.activeUsersLast7Days.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${initialData.engagement.engagementTrendPercentage >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{
                      width: `${Math.min(Math.max(50 + initialData.engagement.engagementTrendPercentage, 10), 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {initialData.engagement.engagementTrendPercentage > 0 ? "+" : ""}
                  {initialData.engagement.engagementTrendPercentage}% vs previous
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted-foreground">
                    Avg Completion Rate
                  </span>
                  <span className="text-2xl font-bold">
                    {(initialData.engagement.averageCompletionRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${initialData.engagement.averageCompletionRate * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {initialData.engagement.completionRateTrendPercentage > 0 ? "+" : ""}
                  {initialData.engagement.completionRateTrendPercentage}% trend
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl border border-border/40 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Automated Intelligence</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This dashboard uses real-time platform metrics to identify operational anomalies
                    and recommend strategic actions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Trends */}
      <TrendCharts moderator={initialData.moderator} content={initialData.content} />
    </div>
  );
}
