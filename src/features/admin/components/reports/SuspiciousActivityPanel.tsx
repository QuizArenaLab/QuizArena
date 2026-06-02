"use client";

import { ShieldAlert, AlertTriangle, User, Zap, Eye } from "lucide-react";
import type { SuspiciousActivitySignal } from "@/types/reports";

interface SuspiciousActivityPanelProps {
  signals: SuspiciousActivitySignal[];
}

function getSeverityClasses(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
    case "HIGH":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-500",
      };
    case "MEDIUM":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-400",
      };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "repeated_reports":
      return AlertTriangle;
    case "rapid_submissions":
      return Zap;
    case "flagged_user":
      return User;
    case "cheating_pattern":
      return ShieldAlert;
    default:
      return Eye;
  }
}

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function SuspiciousActivityPanel({ signals }: SuspiciousActivityPanelProps) {
  if (signals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-[#0A1C40] mb-1">No Suspicious Activity Detected</h3>
        <p className="text-xs text-gray-400">
          The platform is currently showing normal activity patterns. Suspicious activity signals
          will appear here when detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-500" />
        <h2 className="text-sm font-bold text-[#0A1C40]">
          Suspicious Activity Signals ({signals.length})
        </h2>
      </div>

      <div className="space-y-3">
        {signals.map((signal) => {
          const classes = getSeverityClasses(signal.severity);
          const TypeIcon = getTypeIcon(signal.type);

          return (
            <div
              key={signal.id}
              className={`${classes.bg} ${classes.border} border rounded-xl p-4 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${classes.bg}`}>
                  <TypeIcon className={`w-4 h-4 ${classes.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${classes.text}`}>{signal.title}</h4>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${classes.text} bg-white/60`}
                    >
                      {signal.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{signal.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span>{formatTimeAgo(signal.timestamp)}</span>
                    {signal.relatedEntityType && (
                      <span className="capitalize">Entity: {signal.relatedEntityType}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
