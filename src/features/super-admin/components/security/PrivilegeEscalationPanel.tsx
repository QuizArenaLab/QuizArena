"use client";

import type {
  PrivilegeEscalationData,
  EscalationEvent,
  RBACViolationEvent,
} from "@/types/super-admin-security";
import { ThreatSeverityBadge } from "./ThreatSeverityBadge";
import { TrendingUp, Shield, CheckCircle2, User, ArrowRight } from "lucide-react";

interface PrivilegeEscalationPanelProps {
  data: PrivilegeEscalationData;
}

function EscalationThreatBanner({
  level,
}: {
  level: PrivilegeEscalationData["escalationThreatLevel"];
}) {
  const configs = {
    LOW: {
      color: "text-emerald-400",
      bg: "bg-emerald-950/20 border-emerald-900/30",
      label: "LOW — Normal authorization activity",
    },
    ELEVATED: {
      color: "text-amber-400",
      bg: "bg-amber-950/20 border-amber-900/30",
      label: "ELEVATED — Monitor role change activity",
    },
    HIGH: {
      color: "text-orange-400",
      bg: "bg-orange-950/20 border-orange-900/30",
      label: "HIGH — Investigate escalation patterns",
    },
    CRITICAL: {
      color: "text-red-400",
      bg: "bg-red-950/20 border-red-900/40",
      label: "CRITICAL — Immediate governance review required",
    },
  };
  const cfg = configs[level];

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${cfg.bg}`}>
      <TrendingUp className={`w-4 h-4 shrink-0 ${cfg.color}`} />
      <span className={`text-xs font-bold ${cfg.color}`}>Escalation Threat: {cfg.label}</span>
    </div>
  );
}

function EscalationEventRow({ event }: { event: EscalationEvent }) {
  const riskColors = {
    LOW: "text-slate-400",
    MEDIUM: "text-amber-400",
    HIGH: "text-orange-400",
    CRITICAL: "text-red-400",
  };

  return (
    <div className="px-4 py-3 flex items-start gap-3 border-b border-slate-800/40 last:border-0">
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
          event.escalationRisk === "CRITICAL"
            ? "bg-red-500 animate-pulse"
            : event.escalationRisk === "HIGH"
              ? "bg-orange-500"
              : event.escalationRisk === "MEDIUM"
                ? "bg-amber-400"
                : "bg-slate-600"
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-slate-200 leading-tight">
            {event.previousRole ?? "?"} <ArrowRight className="inline w-3 h-3 text-slate-500" />{" "}
            <span className={riskColors[event.escalationRisk]}>{event.newRole ?? "?"}</span>
          </span>
          <ThreatSeverityBadge severity={event.severity} size="xs" />
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
              event.escalationRisk === "CRITICAL"
                ? "text-red-400 bg-red-950/40 border-red-800/40"
                : event.escalationRisk === "HIGH"
                  ? "text-orange-400 bg-orange-950/40 border-orange-800/40"
                  : "text-amber-400 bg-amber-950/40 border-amber-800/40"
            }`}
          >
            {event.escalationRisk} RISK
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-600">
          {event.targetActor && (
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              Target: {event.targetActor.email ?? event.targetActor.id.slice(0, 10)}
            </span>
          )}
          {event.initiatedBy && (
            <span>By: {event.initiatedBy.email ?? event.initiatedBy.id.slice(0, 10)}</span>
          )}
          <span>{event.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

function RBACViolationRow({ event }: { event: RBACViolationEvent }) {
  const eventTypeLabels: Record<string, string> = {
    PRIVILEGE_ESCALATION: "Privilege Escalation",
    RBAC_BYPASS: "RBAC Bypass",
    UNAUTHORIZED_ACCESS: "Unauthorized Access",
    PERMISSION_FAILURE: "Permission Failure",
    HIGH_RISK_BLOCKED: "High-Risk Blocked",
    GOVERNANCE_BREACH: "Governance Breach",
  };

  return (
    <div className="px-4 py-3 flex items-start gap-3 border-b border-slate-800/40 last:border-0">
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
          event.severity === "SEVERE" || event.severity === "CRITICAL"
            ? "bg-red-500 animate-pulse"
            : event.severity === "HIGH"
              ? "bg-amber-400"
              : "bg-slate-600"
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[220px]">
            {event.action}
          </span>
          <ThreatSeverityBadge severity={event.severity} size="xs" />
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-600">
          <span className="bg-slate-800/60 rounded-full px-1.5 py-0.5">
            {eventTypeLabels[event.eventType] ?? event.eventType}
          </span>
          {event.actor && (
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              {event.actor.email ?? event.actor.id.slice(0, 10)}
            </span>
          )}
          <span>{event.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export function PrivilegeEscalationPanel({ data }: PrivilegeEscalationPanelProps) {
  return (
    <div className="space-y-4">
      <EscalationThreatBanner level={data.escalationThreatLevel} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Role Escalations",
            sublabel: "7 days",
            value: data.totalEscalations7d,
            color: data.totalEscalations7d > 3 ? "text-amber-400" : "text-slate-300",
          },
          {
            label: "High-Risk Escalations",
            sublabel: "ADMIN/SUPER_ADMIN",
            value: data.highRiskEscalations,
            color: data.highRiskEscalations > 0 ? "text-red-400" : "text-slate-300",
          },
          {
            label: "RBAC Violations",
            sublabel: "7 days",
            value: data.totalRBACViolations7d,
            color: data.totalRBACViolations7d > 0 ? "text-orange-400" : "text-slate-300",
          },
          {
            label: "Unauthorized Access",
            sublabel: "24h attempts",
            value: data.unauthorizedAccessAttempts24h,
            color: data.unauthorizedAccessAttempts24h > 0 ? "text-red-400" : "text-slate-300",
          },
        ].map((stat) => (
          <div
            key={`${stat.label}-${stat.sublabel}`}
            className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/40"
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
            <p className="text-[10px] text-slate-600">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Role escalation feed */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-400">Role Escalation Events</span>
          </div>
          <span className="text-[10px] text-slate-600">
            Last 7 days · {data.recentEscalations.length}
          </span>
        </div>

        {data.recentEscalations.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No role escalation events detected.</p>
          </div>
        ) : (
          <div>
            {data.recentEscalations.slice(0, 10).map((event) => (
              <EscalationEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* RBAC violations feed */}
      {data.rbacViolations.length > 0 && (
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-400">RBAC Violation Events</span>
            </div>
            <span className="text-[10px] text-slate-600">
              {data.rbacViolations.length} violations
            </span>
          </div>
          <div>
            {data.rbacViolations.slice(0, 10).map((event) => (
              <RBACViolationRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
