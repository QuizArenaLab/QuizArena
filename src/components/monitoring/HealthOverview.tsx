"use client";

import {
  Users,
  Activity,
  Trophy,
  ClipboardList,
  AlertTriangle,
  Database,
  Shield,
  Globe,
} from "lucide-react";
import type { PlatformHealthMetrics } from "@/types/monitoring";
import { StatusBadge } from "./StatusBadge";

interface HealthOverviewProps {
  health: PlatformHealthMetrics;
}

export function HealthOverview({ health }: HealthOverviewProps) {
  const metrics = [
    {
      label: "Active Users",
      value: health.activeUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      risk: "Identifies platform usage patterns and potential inactivity",
    },
    {
      label: "Active Sessions",
      value: health.activeSessions,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      risk: "Tracks authentication health and session integrity",
    },
    {
      label: "Live Challenges",
      value: health.activeChallenges,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
      risk: "Detects content availability and publishing pipeline health",
    },
    {
      label: "Pending Moderation",
      value: health.pendingModerationCount,
      icon: ClipboardList,
      color: "text-violet-600",
      bg: "bg-violet-50",
      risk: "Monitors moderation bottlenecks and content queue backlog",
    },
    {
      label: "Failed Operations",
      value: health.failedOperationsCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      risk: "Surfaces operational failures requiring attention",
    },
    {
      label: "New Signups (24h)",
      value: health.recentSignups,
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
      risk: "Detects signup anomalies and potential abuse patterns",
    },
  ];

  const systemHealthItems = [
    {
      label: "Database",
      status: health.databaseStatus,
      icon: Database,
    },
    {
      label: "Authentication",
      status: health.authHealthStatus,
      icon: Shield,
    },
    {
      label: "API Layer",
      status: health.apiHealthStatus,
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      <div
        className={`rounded-xl border p-5 flex items-center justify-between ${
          health.overallStatus === "HEALTHY"
            ? "bg-emerald-50/50 border-emerald-200"
            : health.overallStatus === "WARNING"
              ? "bg-amber-50/50 border-amber-200"
              : "bg-red-50/50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg ${
              health.overallStatus === "HEALTHY"
                ? "bg-emerald-100"
                : health.overallStatus === "WARNING"
                  ? "bg-amber-100"
                  : "bg-red-100"
            }`}
          >
            <Activity
              className={`w-5 h-5 ${
                health.overallStatus === "HEALTHY"
                  ? "text-emerald-600"
                  : health.overallStatus === "WARNING"
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1C40]">Platform Operational Status</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {health.overallStatus === "HEALTHY"
                ? "All systems operating normally"
                : health.overallStatus === "WARNING"
                  ? "Some systems require attention"
                  : "Critical issues detected — immediate action required"}
            </p>
          </div>
        </div>
        <StatusBadge status={health.overallStatus} size="lg" pulse />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <span className="text-2xl font-bold text-[#0A1C40] tabular-nums">
                  {metric.value.toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#0A1C40]">{metric.label}</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {metric.risk}
              </p>
            </div>
          );
        })}
      </div>

      {/* System Health Indicators */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-[#0A1C40] mb-4">Infrastructure Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {systemHealthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-100/50"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-[#0A1C40]">{item.label}</span>
                </div>
                <StatusBadge status={item.status} size="sm" pulse />
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Stats Footer */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50/50 rounded-lg">
          <p className="text-lg font-bold text-[#0A1C40] tabular-nums">
            {health.totalUsers.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">Total Users</p>
        </div>
        <div className="text-center p-3 bg-gray-50/50 rounded-lg">
          <p className="text-lg font-bold text-[#0A1C40] tabular-nums">
            {health.totalChallenges.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">Total Challenges</p>
        </div>
        <div className="text-center p-3 bg-gray-50/50 rounded-lg">
          <p className="text-lg font-bold text-[#0A1C40] tabular-nums">
            {health.totalAttempts.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">Total Attempts</p>
        </div>
      </div>
    </div>
  );
}
