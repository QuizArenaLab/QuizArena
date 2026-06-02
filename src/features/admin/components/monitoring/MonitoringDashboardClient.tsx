"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  LayoutDashboard,
  Zap,
  Bell,
  AlertTriangle,
  BarChart3,
  Clock,
} from "lucide-react";
import type { MonitoringDashboardData } from "@/types/monitoring";
import { HealthOverview } from "./HealthOverview";
import { BackgroundJobsPanel } from "./BackgroundJobsPanel";
import { AlertCenter } from "./AlertCenter";
import { FailureInspector } from "./FailureInspector";
import { ActivityFeed } from "./ActivityFeed";
import { MonitoringCharts } from "./MonitoringCharts";

interface MonitoringDashboardClientProps {
  initialData: MonitoringDashboardData;
}

type MonitoringTab = "overview" | "jobs" | "alerts" | "failures" | "activity" | "trends";

const TABS: { id: MonitoringTab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Health", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Zap },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "failures", label: "Failures", icon: AlertTriangle },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "trends", label: "Trends", icon: BarChart3 },
];

function getInitialTab(): MonitoringTab {
  if (typeof window === "undefined") return "overview";
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") as MonitoringTab | null;
  if (tab && TABS.some((t) => t.id === tab)) {
    return tab;
  }
  return "overview";
}

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function MonitoringDashboardClient({ initialData }: MonitoringDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<MonitoringTab>(getInitialTab);
  const [data, setData] = useState<MonitoringDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Auto-update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { getMonitoringDashboardData } = await import("@/features/admin/services/monitoring");
      const freshData = await getMonitoringDashboardData();
      setData(freshData);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to refresh monitoring data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const criticalAlerts = data.alerts.filter((a) => a.severity === "CRITICAL").length;
  const unresolvedFailures = data.failures.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#0A1C40] to-[#2471e7] rounded-xl">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0A1C40]">Platform Monitoring</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last updated: {formatLastUpdated(lastRefreshed)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Status Indicators */}
          {criticalAlerts > 0 && (
            <button
              onClick={() => setActiveTab("alerts")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-semibold hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              {criticalAlerts} Critical
            </button>
          )}
          {unresolvedFailures > 0 && (
            <button
              onClick={() => setActiveTab("failures")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-semibold hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              {unresolvedFailures} Failures
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#0A1C40] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasNotification =
            (tab.id === "alerts" && criticalAlerts > 0) ||
            (tab.id === "failures" && unresolvedFailures > 0);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap relative ${
                isActive
                  ? "bg-[#0A1C40] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0A1C40] hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {hasNotification && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-red-400" : "bg-red-500"
                  } animate-pulse`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && <HealthOverview health={data.health} />}
        {activeTab === "jobs" && <BackgroundJobsPanel jobs={data.jobs} />}
        {activeTab === "alerts" && <AlertCenter alerts={data.alerts} />}
        {activeTab === "failures" && <FailureInspector failures={data.failures} />}
        {activeTab === "activity" && <ActivityFeed events={data.activityFeed} />}
        {activeTab === "trends" && (
          <MonitoringCharts
            userActivity={data.trends.userActivity}
            attempts={data.trends.attempts}
            failureRate={data.trends.failureRate}
            moderationThroughput={data.trends.moderationThroughput}
          />
        )}
      </div>
    </div>
  );
}
