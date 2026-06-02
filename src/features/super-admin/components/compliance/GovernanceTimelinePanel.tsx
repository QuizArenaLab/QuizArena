/**
 * QuizArena — Governance Timeline Component
 *
 * Chronological forensic event list with:
 * - Severity classification badges
 * - Actor identity display
 * - Entity type indicators
 * - Governance category tags
 * - Action metadata preview
 * - Timestamps with "time ago"
 *
 * Server component — fully pre-rendered.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { GovernanceTimeline } from "@/types/super-admin-compliance";
import { SeverityBadge } from "./SeverityBadge";
import {
  User,
  Server,
  Shield,
  Key,
  Settings,
  FileText,
  AlertTriangle,
  Activity,
  Clock,
  ChevronRight,
} from "lucide-react";

interface GovernanceTimelineProps {
  timeline: GovernanceTimeline;
}

const ENTITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  USER: User,
  ROLE: Key,
  SYSTEM: Server,
  SECURITY: Shield,
  AUTH: Shield,
  SETTINGS: Settings,
  MODERATION: AlertTriangle,
  FINANCIAL: Activity,
  CHALLENGE: FileText,
  QUESTION: FileText,
  REPORT: AlertTriangle,
};

const CATEGORY_COLORS: Record<string, string> = {
  AUTHENTICATION: "text-blue-400 bg-blue-950/30 border-blue-900/40",
  ROLE_GOVERNANCE: "text-purple-400 bg-purple-950/30 border-purple-900/40",
  FINANCIAL_CONTROL: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  INFRASTRUCTURE: "text-orange-400 bg-orange-950/30 border-orange-900/40",
  SECURITY: "text-red-400 bg-red-950/30 border-red-900/40",
  COMPLIANCE: "text-cyan-400 bg-cyan-950/30 border-cyan-900/40",
  PLATFORM_CONTROLS: "text-violet-400 bg-violet-950/30 border-violet-900/40",
  SESSION_MANAGEMENT: "text-teal-400 bg-teal-950/30 border-teal-900/40",
  HIGH_RISK_ACTION: "text-rose-400 bg-rose-950/30 border-rose-900/40",
  DATA_ACCESS: "text-sky-400 bg-sky-950/30 border-sky-900/40",
  MODERATION: "text-amber-400 bg-amber-950/30 border-amber-900/40",
  SETTINGS: "text-slate-400 bg-slate-800/40 border-slate-700/40",
  SYSTEM: "text-slate-400 bg-slate-800/40 border-slate-700/40",
  UNKNOWN: "text-slate-500 bg-slate-800/30 border-slate-700/30",
};

function truncateAction(action: string, maxLen = 60): string {
  if (action.length <= maxLen) return action;
  return action.slice(0, maxLen) + "…";
}

export function GovernanceTimelinePanel({ timeline }: GovernanceTimelineProps) {
  if (timeline.entries.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/40">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">No governance events found</p>
        <p className="text-xs text-slate-600 mt-1">
          Audit events will appear here as governance operations occur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[1fr_100px_120px_80px_100px] gap-3 px-4 py-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800/40">
        <span>Action / Actor</span>
        <span>Entity</span>
        <span>Category</span>
        <span className="text-right">Severity</span>
        <span className="text-right">Time</span>
      </div>

      {/* Timeline entries */}
      <div className="divide-y divide-slate-800/30">
        {timeline.entries.map((entry) => {
          const EntityIcon = ENTITY_ICONS[entry.entityType] ?? FileText;
          const categoryColorClass =
            CATEGORY_COLORS[entry.governanceCategory] ?? CATEGORY_COLORS.UNKNOWN;

          return (
            <div
              key={entry.id}
              className={`group grid grid-cols-1 md:grid-cols-[1fr_100px_120px_80px_100px] gap-2 md:gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors ${
                entry.severity === "SEVERE"
                  ? "border-l-2 border-red-600/60"
                  : entry.severity === "CRITICAL"
                    ? "border-l-2 border-orange-600/40"
                    : "border-l-2 border-transparent"
              }`}
            >
              {/* Action + Actor */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  {entry.isSovereignAction && <Shield className="w-3 h-3 text-red-400 shrink-0" />}
                  <span className="text-xs font-mono text-slate-300 truncate" title={entry.action}>
                    {truncateAction(entry.action)}
                  </span>
                </div>
                {entry.actor && (
                  <div className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5 text-slate-600" />
                    <span className="text-[10px] text-slate-600 truncate">
                      {entry.actor.name ?? entry.actor.email ?? entry.actor.id.slice(0, 8)}{" "}
                      <span className="text-slate-700">·</span>{" "}
                      <span className="font-mono">{entry.actor.role}</span>
                    </span>
                  </div>
                )}
                {!entry.actor && (
                  <span className="text-[10px] text-slate-700">System · No actor</span>
                )}
              </div>

              {/* Entity type */}
              <div className="flex items-center gap-1.5">
                <EntityIcon className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-[10px] text-slate-500 font-mono">{entry.entityType}</span>
              </div>

              {/* Category */}
              <div className="flex items-center">
                <span
                  className={`text-[9px] font-bold rounded border px-1.5 py-0.5 truncate max-w-[110px] ${categoryColorClass}`}
                >
                  {entry.governanceCategory.replace(/_/g, " ")}
                </span>
              </div>

              {/* Severity */}
              <div className="flex items-center md:justify-end">
                <SeverityBadge severity={entry.severity} size="xs" />
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 md:justify-end">
                <Clock className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                  {entry.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/40">
        <p className="text-[10px] text-slate-700">
          Showing {timeline.filteredCount} of {timeline.totalCount.toLocaleString()} events
        </p>
        {timeline.hasMore && (
          <button className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-default">
            <span>Load more events</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
