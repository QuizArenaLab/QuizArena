"use client";

import { Bell, AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react";
import type { SystemAlert } from "@/types/monitoring";
import { StatusBadge } from "./StatusBadge";

interface AlertCenterProps {
  alerts: SystemAlert[];
}

const SEVERITY_ICONS = {
  CRITICAL: AlertTriangle,
  WARNING: AlertCircle,
  INFO: Info,
} as const;

const SEVERITY_BORDER = {
  CRITICAL: "border-l-red-500",
  WARNING: "border-l-amber-500",
  INFO: "border-l-sky-400",
} as const;

const CATEGORY_LABELS: Record<string, string> = {
  publishing: "Publishing",
  moderation: "Moderation",
  authentication: "Auth",
  operations: "Operations",
  security: "Security",
  performance: "Performance",
};

function formatAlertTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AlertCenter({ alerts }: AlertCenterProps) {
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING").length;
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-amber-500" />
            {unacknowledgedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-[#0A1C40]">Alert Center</span>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-2">
        {alerts.map((alert) => {
          const SeverityIcon = SEVERITY_ICONS[alert.severity];
          const borderClass = SEVERITY_BORDER[alert.severity];

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-lg border border-gray-100 border-l-[3px] ${borderClass} p-4 hover:shadow-sm transition-shadow duration-200 ${
                alert.acknowledged ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <SeverityIcon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    alert.severity === "CRITICAL"
                      ? "text-red-500"
                      : alert.severity === "WARNING"
                        ? "text-amber-500"
                        : "text-sky-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[#0A1C40] truncate">{alert.title}</h4>
                    <StatusBadge status={alert.severity} size="sm" />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatAlertTime(alert.timestamp)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                        {CATEGORY_LABELS[alert.category] ?? alert.category}
                      </span>
                    </div>
                    {alert.actionUrl && (
                      <a
                        href={alert.actionUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2471e7] hover:text-[#2471e7]/80 transition-colors"
                      >
                        {alert.actionLabel || "View"}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No active alerts</p>
        </div>
      )}
    </div>
  );
}
