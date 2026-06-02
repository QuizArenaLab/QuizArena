"use client";

import type { SessionGovernanceData, PrivilegedSession } from "@/types/super-admin-security";
import { CheckCircle2, User, Clock, AlertTriangle } from "lucide-react";

interface SessionGovernancePanelProps {
  data: SessionGovernanceData;
}

function HealthBanner({ status }: { status: SessionGovernanceData["sessionHealthStatus"] }) {
  const configs = {
    HEALTHY: {
      color: "text-emerald-400",
      bg: "bg-emerald-950/20 border-emerald-900/30",
      icon: CheckCircle2,
      label: "HEALTHY — Session governance within normal parameters",
    },
    ELEVATED: {
      color: "text-amber-400",
      bg: "bg-amber-950/20 border-amber-900/30",
      icon: AlertTriangle,
      label: "ELEVATED — Review high-risk sessions",
    },
    CRITICAL: {
      color: "text-red-400",
      bg: "bg-red-950/20 border-red-900/40",
      icon: AlertTriangle,
      label: "CRITICAL — Privileged session intervention may be required",
    },
  };
  const cfg = configs[status];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${cfg.bg}`}>
      <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
      <span className={`text-xs font-bold ${cfg.color}`}>Session Health: {cfg.label}</span>
    </div>
  );
}

function SessionCard({ session }: { session: PrivilegedSession }) {
  const riskBorder =
    session.riskLevel === "CRITICAL"
      ? "border-red-800/50 bg-red-950/10"
      : session.riskLevel === "HIGH"
        ? "border-amber-800/40 bg-amber-950/10"
        : "border-slate-800/40 bg-slate-900/60";

  const riskColor =
    session.riskLevel === "CRITICAL"
      ? "text-red-400"
      : session.riskLevel === "HIGH"
        ? "text-amber-400"
        : session.riskLevel === "MEDIUM"
          ? "text-cyan-400"
          : "text-slate-500";

  const hoursUntilExpiry = Math.floor(session.expiresInMinutes / 60);
  const minutesUntilExpiry = session.expiresInMinutes % 60;

  const ageHours = Math.floor(session.ageMinutes / 60);
  const ageMinutes = session.ageMinutes % 60;

  return (
    <div className={`p-3.5 rounded-xl border ${riskBorder} flex items-start gap-3`}>
      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
          <div>
            <p className="text-xs font-bold text-slate-200 truncate max-w-[160px]">
              {session.actor.name ?? session.actor.email ?? session.actor.id.slice(0, 12)}
            </p>
            <p className="text-[10px] text-slate-600 truncate">
              {session.actor.email ?? session.actor.id}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                session.riskLevel === "CRITICAL"
                  ? "text-red-400 bg-red-950/40 border-red-800/40"
                  : session.riskLevel === "HIGH"
                    ? "text-amber-400 bg-amber-950/40 border-amber-800/40"
                    : session.riskLevel === "MEDIUM"
                      ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/40"
                      : "text-slate-500 bg-slate-800/60 border-slate-700/50"
              }`}
            >
              {session.riskLevel}
            </span>
            {session.isStale && (
              <span className="text-[9px] font-bold text-orange-400 bg-orange-950/40 border border-orange-800/40 px-1.5 py-0.5 rounded-full">
                STALE
              </span>
            )}
          </div>
        </div>

        {/* Session metadata */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-slate-600 mb-2">
          <span>
            Role: <span className="text-slate-400 font-medium">{session.actor.role}</span>
          </span>
          <span>
            Score: <span className={`font-bold ${riskColor}`}>{session.riskScore}/100</span>
          </span>
          <span>
            Age:{" "}
            <span className="text-slate-400">
              {ageHours > 0 ? `${ageHours}h ` : ""}
              {ageMinutes}m
            </span>
          </span>
          <span>
            Expires:{" "}
            <span className="text-slate-400">
              {hoursUntilExpiry > 0 ? `${hoursUntilExpiry}h ` : ""}
              {minutesUntilExpiry}m
            </span>
          </span>
        </div>

        {/* Risk score bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                session.riskLevel === "CRITICAL"
                  ? "bg-red-500"
                  : session.riskLevel === "HIGH"
                    ? "bg-amber-400"
                    : session.riskLevel === "MEDIUM"
                      ? "bg-cyan-400"
                      : "bg-slate-600"
              }`}
              style={{ width: `${session.riskScore}%` }}
            />
          </div>
        </div>

        {/* Risk factors */}
        {session.riskFactors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {session.riskFactors.map((factor, i) => (
              <span
                key={i}
                className="text-[9px] text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/40"
              >
                {factor}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SessionGovernancePanel({ data }: SessionGovernancePanelProps) {
  const ageHours = Math.floor(data.averageSessionAgeMinutes / 60);
  const ageMinutes = data.averageSessionAgeMinutes % 60;

  return (
    <div className="space-y-4">
      <HealthBanner status={data.sessionHealthStatus} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Active Sessions",
            value: data.totalActiveSessions,
            color: "text-blue-400",
          },
          {
            label: "Stale Sessions",
            value: data.staleSessions,
            color:
              data.staleSessions > 5
                ? "text-red-400"
                : data.staleSessions > 0
                  ? "text-amber-400"
                  : "text-slate-300",
          },
          {
            label: "High-Risk Sessions",
            value: data.highRiskSessions,
            color: data.highRiskSessions > 0 ? "text-orange-400" : "text-slate-300",
          },
          {
            label: "Avg. Session Age",
            value: ageHours > 0 ? `${ageHours}h ${ageMinutes}m` : `${ageMinutes}m`,
            color: ageHours > 8 ? "text-amber-400" : "text-slate-300",
            isString: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/40"
          >
            <p className={`text-xl font-black leading-tight ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-400">Active Privileged Sessions</span>
          </div>
          <span className="text-[10px] text-slate-600">Sorted by risk score</span>
        </div>

        {data.activeSessions.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No active privileged sessions.</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {data.activeSessions.slice(0, 10).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
            {data.activeSessions.length > 10 && (
              <p className="text-[10px] text-slate-700 text-center py-2">
                +{data.activeSessions.length - 10} more sessions
              </p>
            )}
          </div>
        )}
      </div>

      {/* Future capabilities */}
      <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/30">
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
          Future Session Governance Capabilities
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Device Fingerprinting",
            "Trusted Devices",
            "Session Risk Scoring",
            "Force Invalidation",
            "Geo-Security",
          ].map((cap) => (
            <span
              key={cap}
              className="text-[9px] text-slate-700 bg-slate-800/40 border border-slate-700/30 px-2 py-0.5 rounded-full"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
