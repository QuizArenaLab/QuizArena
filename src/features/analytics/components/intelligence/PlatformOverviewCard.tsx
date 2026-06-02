"use client";

import { Activity, Users, FileText, AlertCircle, TrendingUp } from "lucide-react";
import type { PlatformOverview, OperationalStatus } from "@/features/analytics/services/intelligence/types";

interface PlatformOverviewCardProps {
  data: PlatformOverview;
}

const statusColors: Record<OperationalStatus, string> = {
  STABLE:
    "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  WATCH:
    "bg-amber-500/15 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  DECLINING:
    "bg-orange-500/15 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  CRITICAL:
    "bg-rose-500/15 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800",
};

const statusIcons: Record<OperationalStatus, React.ReactNode> = {
  STABLE: <Activity className="w-4 h-4 mr-1" />,
  WATCH: <Activity className="w-4 h-4 mr-1" />,
  DECLINING: <Activity className="w-4 h-4 mr-1" />,
  CRITICAL: <Activity className="w-4 h-4 mr-1" />,
};

export function PlatformOverviewCard({ data }: PlatformOverviewCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden col-span-full">
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Platform Operations Overview</h3>
          <p className="text-sm text-muted-foreground">
            High-level health and throughput of the platform.
          </p>
        </div>
        <div
          className={`flex items-center px-2.5 py-0.5 rounded-full border text-sm font-medium ${statusColors[data.status]}`}
        >
          {statusIcons[data.status]}
          {data.status}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col space-y-2 p-4 bg-muted/30 rounded-lg border border-border/40">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="w-4 h-4 mr-2" /> User Growth
            </span>
            <span className="text-3xl font-bold">{data.totalActiveUsers.toLocaleString()}</span>
            <span
              className={`text-xs font-medium flex items-center ${data.userGrowthPercentage >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {data.userGrowthPercentage >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              )}
              {Math.abs(data.userGrowthPercentage)}% vs last 7d
            </span>
          </div>

          <div className="flex flex-col space-y-2 p-4 bg-muted/30 rounded-lg border border-border/40">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Published Content
            </span>
            <span className="text-3xl font-bold">
              {data.totalChallengesPublished.toLocaleString()}
            </span>
            <span
              className={`text-xs font-medium flex items-center ${data.challengePublishingVelocity >= 0 ? "text-emerald-500" : "text-amber-500"}`}
            >
              {data.challengePublishingVelocity >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              )}
              {Math.abs(data.challengePublishingVelocity)}% velocity
            </span>
          </div>

          <div className="flex flex-col space-y-2 p-4 bg-muted/30 rounded-lg border border-border/40">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> Review Backlog
            </span>
            <span className="text-3xl font-bold">{data.reviewBacklogSize.toLocaleString()}</span>
            <span
              className={`text-xs font-medium flex items-center ${data.backlogGrowthPercentage <= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {data.backlogGrowthPercentage <= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              ) : (
                <TrendingUp className="w-3 h-3 mr-1" />
              )}
              {Math.abs(data.backlogGrowthPercentage)}% backlog growth
            </span>
          </div>

          <div className="flex flex-col space-y-2 p-4 bg-muted/30 rounded-lg border border-border/40">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Mod Throughput
            </span>
            <span className="text-3xl font-bold">{data.moderationThroughput.toLocaleString()}</span>
            <span className="text-xs font-medium text-muted-foreground">
              Items reviewed in last 7d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
