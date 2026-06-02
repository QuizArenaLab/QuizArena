/**
 * QuizArena — Security Forensics Panel
 *
 * Enterprise security intelligence display:
 * - Threat level indicator
 * - CRITICAL/HIGH severity event list
 * - Auth anomaly events
 * - RBAC violation events
 * - Infrastructure override events
 *
 * Server component — fully pre-rendered.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { SecurityForensicsData, SecurityForensicEvent } from "@/types/super-admin-compliance";
import { SeverityBadge } from "./SeverityBadge";
import { ShieldAlert, Shield, Key, Server, User, Clock, Zap, AlertOctagon } from "lucide-react";

interface SecurityForensicsPanelProps {
  data: SecurityForensicsData;
}

const THREAT_LEVEL_CONFIG = {
  LOW: {
    label: "LOW THREAT",
    color: "text-emerald-400",
    bg: "bg-emerald-950/20",
    border: "border-emerald-900/30",
    dotColor: "bg-emerald-500",
  },
  ELEVATED: {
    label: "ELEVATED THREAT",
    color: "text-amber-400",
    bg: "bg-amber-950/20",
    border: "border-amber-900/30",
    dotColor: "bg-amber-500",
  },
  HIGH: {
    label: "HIGH THREAT",
    color: "text-orange-400",
    bg: "bg-orange-950/20",
    border: "border-orange-900/30",
    dotColor: "bg-orange-500",
  },
  CRITICAL: {
    label: "CRITICAL THREAT",
    color: "text-red-400",
    bg: "bg-red-950/30",
    border: "border-red-900/40",
    dotColor: "bg-red-500",
  },
};

const SECURITY_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  AUTH_FAILURE: Shield,
  ROLE_ESCALATION: Key,
  UNAUTHORIZED_ACCESS: ShieldAlert,
  INFRASTRUCTURE_OVERRIDE: Server,
  SESSION_ANOMALY: AlertOctagon,
  PERMISSION_FAILURE: Shield,
  GOVERNANCE_BREACH: AlertOctagon,
  HIGH_RISK_BLOCKED: Zap,
  CRITICAL_OPERATION: Zap,
  SUSPICIOUS_PATTERN: AlertOctagon,
};

function SecurityEventRow({ event }: { event: SecurityForensicEvent }) {
  const Icon = SECURITY_TYPE_ICONS[event.securityEventType] ?? Shield;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-800/30 last:border-0">
      <div className="w-6 h-6 rounded-md bg-slate-800/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3 h-3 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-300 break-all leading-relaxed flex-1">
            {event.action.length > 70 ? event.action.slice(0, 70) + "…" : event.action}
          </span>
          <SeverityBadge severity={event.severity} size="xs" />
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {event.actor && (
            <div className="flex items-center gap-1">
              <User className="w-2.5 h-2.5 text-slate-700" />
              <span className="text-[10px] text-slate-600">
                {event.actor.name ?? event.actor.email ?? event.actor.id.slice(0, 8)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-slate-700" />
            <span className="text-[10px] text-slate-600">{event.timeAgo}</span>
          </div>
          {event.ipAddress && event.ipAddress !== "unknown" && (
            <span className="text-[10px] text-slate-700 font-mono">{event.ipAddress}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-6 text-center">
      <Shield className="w-6 h-6 text-slate-700 mx-auto mb-2" />
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

export function SecurityForensicsPanel({ data }: SecurityForensicsPanelProps) {
  const threatConfig = THREAT_LEVEL_CONFIG[data.threatLevel];

  return (
    <div className="space-y-4">
      {/* Threat Level Banner */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl border ${threatConfig.bg} ${threatConfig.border}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${threatConfig.dotColor} ${data.threatLevel !== "LOW" ? "animate-pulse" : ""}`}
          />
          <div>
            <p className={`text-sm font-bold ${threatConfig.color}`}>{threatConfig.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Platform-wide security threat assessment based on recent governance events
            </p>
          </div>
        </div>
        <ShieldAlert className={`w-5 h-5 shrink-0 ${threatConfig.color}`} />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "CRITICAL Events (7d)",
            value: data.totalCritical7d,
            color: data.totalCritical7d > 0 ? "text-orange-400" : "text-slate-500",
          },
          {
            label: "HIGH Events (7d)",
            value: data.totalHigh7d,
            color: data.totalHigh7d > 5 ? "text-amber-400" : "text-slate-400",
          },
          {
            label: "Auth Anomalies (24h)",
            value: data.authFailures24h,
            color: data.authFailures24h > 0 ? "text-blue-400" : "text-slate-500",
          },
          {
            label: "RBAC Violations (7d)",
            value: data.rbacViolations7d,
            color: data.rbacViolations7d > 0 ? "text-purple-400" : "text-slate-500",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/40"
          >
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              {metric.label}
            </p>
            <p className={`text-xl font-bold tabular-nums ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Critical Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Critical Events */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-slate-200">Critical Events (7d)</h3>
            <span className="ml-auto text-[10px] text-slate-600">
              {data.recentCriticalEvents.length} events
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {data.recentCriticalEvents.length > 0 ? (
              data.recentCriticalEvents
                .slice(0, 8)
                .map((event) => <SecurityEventRow key={event.id} event={event} />)
            ) : (
              <EmptyState label="No critical events detected in last 7 days" />
            )}
          </div>
        </div>

        {/* Auth + RBAC Events */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-200">Auth & RBAC Events (7d)</h3>
            <span className="ml-auto text-[10px] text-slate-600">
              {data.authEvents.length + data.rbacEvents.length} events
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {data.authEvents.length > 0 || data.rbacEvents.length > 0 ? (
              [...data.authEvents, ...data.rbacEvents]
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 8)
                .map((event) => <SecurityEventRow key={event.id} event={event} />)
            ) : (
              <EmptyState label="No auth or RBAC events in last 7 days" />
            )}
          </div>
        </div>
      </div>

      {/* Infrastructure Events */}
      {data.infrastructureEvents.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-orange-900/20">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold text-slate-200">
              Infrastructure Override Events (7d)
            </h3>
            <span className="ml-auto text-[10px] text-orange-500/60">
              {data.infrastructureEvents.length} events
            </span>
          </div>
          <div>
            {data.infrastructureEvents.slice(0, 5).map((event) => (
              <SecurityEventRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
