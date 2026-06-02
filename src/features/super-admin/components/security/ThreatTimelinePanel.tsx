"use client";

import type { ThreatTimeline, ThreatTimelineEntry } from "@/types/super-admin-security";
import { ThreatSeverityBadge } from "./ThreatSeverityBadge";
import { Activity, User, ArrowRight, ChevronDown } from "lucide-react";

interface ThreatTimelinePanelProps {
  timeline: ThreatTimeline;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  AUTH_FAILURE: "Auth Failure",
  BRUTE_FORCE: "Brute Force",
  PRIVILEGE_ESCALATION: "Privilege Escalation",
  RBAC_BYPASS: "RBAC Bypass",
  SESSION_ANOMALY: "Session Anomaly",
  SUSPICIOUS_PATTERN: "Suspicious Pattern",
  GOVERNANCE_BREACH: "Governance Breach",
  INFRASTRUCTURE_OVERRIDE: "Infrastructure Override",
  PERMISSION_FAILURE: "Permission Failure",
  HIGH_RISK_BLOCKED: "High-Risk Blocked",
  CRITICAL_OPERATION: "Critical Operation",
  UNAUTHORIZED_ACCESS: "Unauthorized Access",
};

function TimelineEntry({ entry }: { entry: ThreatTimelineEntry }) {
  const typeLabel = EVENT_TYPE_LABELS[entry.eventType] ?? entry.eventType;
  const isHighSeverity = entry.severity === "SEVERE" || entry.severity === "CRITICAL";
  const timeFormatted = new Date(entry.timestampISO).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex gap-3 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-2 ${
            entry.severity === "SEVERE"
              ? "bg-red-500 ring-red-900/60 animate-pulse"
              : entry.severity === "CRITICAL"
                ? "bg-orange-500 ring-orange-900/60"
                : entry.severity === "HIGH"
                  ? "bg-amber-400 ring-amber-900/60"
                  : entry.severity === "MEDIUM"
                    ? "bg-cyan-400 ring-cyan-900/60"
                    : "bg-slate-600 ring-slate-800/60"
          }`}
        />
        <div className="w-px flex-1 bg-slate-800/60 mt-1" />
      </div>

      {/* Event content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-200 leading-tight break-all max-w-[280px]">
              {entry.action}
            </span>
            {entry.isSovereignThreat && (
              <span className="text-[9px] font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-1.5 py-0.5 rounded-full tracking-wider uppercase shrink-0">
                SOVEREIGN
              </span>
            )}
          </div>
          <ThreatSeverityBadge severity={entry.severity} size="xs" />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 mb-1.5">
          <span className="bg-slate-800/60 rounded-full px-1.5 py-0.5">{typeLabel}</span>
          <span className="font-mono">{timeFormatted}</span>
          <span className="text-slate-700">{entry.timeAgo}</span>

          {entry.actor && (
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              <span className="text-slate-500">
                {entry.actor.email ?? entry.actor.id.slice(0, 12)}
              </span>
              <span className="text-slate-700">({entry.actor.role})</span>
            </span>
          )}

          {entry.ipAddress && <span className="font-mono text-slate-600">{entry.ipAddress}</span>}
        </div>

        {isHighSeverity && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
            <ArrowRight className="w-2.5 h-2.5" />
            <span>{entry.investigationWorkflow}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThreatTimelinePanel({ timeline }: ThreatTimelinePanelProps) {
  const dateGroups = new Map<string, ThreatTimelineEntry[]>();

  for (const entry of timeline.entries) {
    const dateKey = new Date(entry.timestampISO).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const existing = dateGroups.get(dateKey) ?? [];
    existing.push(entry);
    dateGroups.set(dateKey, existing);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-400">Threat Event Timeline</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-600">
          <span>{timeline.filteredCount} shown</span>
          <span className="text-slate-700">of {timeline.totalCount.toLocaleString()} total</span>
          {timeline.hasMore && (
            <span className="flex items-center gap-1 text-blue-500">
              <ChevronDown className="w-3 h-3" />
              More events
            </span>
          )}
        </div>
      </div>

      {/* Timeline body */}
      <div className="px-5 pt-5">
        {timeline.entries.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No threat events in the monitoring window.
            </p>
            <p className="text-xs text-slate-700 mt-1">Security posture looks clean.</p>
          </div>
        ) : (
          <div>
            {Array.from(dateGroups.entries()).map(([dateKey, entries]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                    {dateKey}
                  </span>
                  <div className="flex-1 h-px bg-slate-800/40" />
                  <span className="text-[10px] text-slate-700">{entries.length} events</span>
                </div>
                <div>
                  {entries.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}

            {timeline.hasMore && (
              <div className="pb-4 text-center">
                <p className="text-[10px] text-slate-700">
                  {timeline.totalCount - timeline.filteredCount} additional events not shown.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
