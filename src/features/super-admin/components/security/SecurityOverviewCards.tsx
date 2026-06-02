"use client";

import type { SecurityOverview } from "@/types/super-admin-security";
import { Shield, AlertTriangle, Lock, Activity, Users, TrendingUp, Zap, Eye } from "lucide-react";

interface SecurityOverviewCardsProps {
  overview: SecurityOverview;
}

function PostureGauge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : score >= 40
          ? "text-orange-400"
          : "text-red-400";

  const ring =
    score >= 80
      ? "ring-emerald-500/30"
      : score >= 60
        ? "ring-amber-500/30"
        : score >= 40
          ? "ring-orange-500/30"
          : "ring-red-500/30";

  const bg =
    score >= 80
      ? "bg-emerald-950/40"
      : score >= 60
        ? "bg-amber-950/40"
        : score >= 40
          ? "bg-orange-950/40"
          : "bg-red-950/40";

  return (
    <div
      className={`w-14 h-14 rounded-full ring-2 ${ring} ${bg} flex items-center justify-center flex-col shrink-0`}
    >
      <span className={`text-lg font-black leading-none ${color}`}>{score}</span>
      <span className="text-[8px] text-slate-600 leading-none">/ 100</span>
    </div>
  );
}

function ThreatStatusBadge({ status }: { status: SecurityOverview["platformThreatStatus"] }) {
  const configs = {
    SECURE: {
      label: "SECURE",
      color: "text-emerald-400",
      bg: "bg-emerald-950/40",
      border: "border-emerald-800/40",
      pulse: false,
    },
    ELEVATED: {
      label: "ELEVATED",
      color: "text-amber-400",
      bg: "bg-amber-950/40",
      border: "border-amber-800/40",
      pulse: false,
    },
    THREATENED: {
      label: "THREATENED",
      color: "text-orange-400",
      bg: "bg-orange-950/40",
      border: "border-orange-800/40",
      pulse: true,
    },
    CRITICAL: {
      label: "CRITICAL",
      color: "text-red-400",
      bg: "bg-red-950/40",
      border: "border-red-800/40",
      pulse: true,
    },
  };
  const cfg = configs[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "SECURE" ? "bg-emerald-400" : status === "ELEVATED" ? "bg-amber-400" : "bg-red-500"} ${cfg.pulse ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  );
}

export function SecurityOverviewCards({ overview }: SecurityOverviewCardsProps) {
  const kpiCards = [
    {
      label: "Auth Failures",
      sublabel: "Last 24h",
      value: overview.authFailures24h,
      icon: Lock,
      color:
        overview.authFailures24h > 10
          ? "text-red-400"
          : overview.authFailures24h > 3
            ? "text-amber-400"
            : "text-slate-400",
      iconBg:
        overview.authFailures24h > 10
          ? "bg-red-950/40"
          : overview.authFailures24h > 3
            ? "bg-amber-950/40"
            : "bg-slate-800/60",
      border:
        overview.authFailures24h > 10
          ? "border-red-900/40"
          : overview.authFailures24h > 3
            ? "border-amber-900/40"
            : "border-slate-800/40",
    },
    {
      label: "Critical Threats",
      sublabel: "Last 24h",
      value: overview.criticalThreats,
      icon: AlertTriangle,
      color: overview.criticalThreats > 0 ? "text-orange-400" : "text-slate-400",
      iconBg: overview.criticalThreats > 0 ? "bg-orange-950/40" : "bg-slate-800/60",
      border: overview.criticalThreats > 0 ? "border-orange-900/40" : "border-slate-800/40",
    },
    {
      label: "Active Alerts",
      sublabel: "Real-time",
      value: overview.activeAlerts,
      icon: Zap,
      color:
        overview.activeAlerts > 5
          ? "text-red-400"
          : overview.activeAlerts > 0
            ? "text-amber-400"
            : "text-emerald-400",
      iconBg:
        overview.activeAlerts > 5
          ? "bg-red-950/40"
          : overview.activeAlerts > 0
            ? "bg-amber-950/40"
            : "bg-emerald-950/40",
      border:
        overview.activeAlerts > 5
          ? "border-red-900/40"
          : overview.activeAlerts > 0
            ? "border-amber-900/40"
            : "border-emerald-900/40",
    },
    {
      label: "Priv. Escalations",
      sublabel: "Last 24h",
      value: overview.privilegeEscalations24h,
      icon: TrendingUp,
      color:
        overview.privilegeEscalations24h > 2
          ? "text-red-400"
          : overview.privilegeEscalations24h > 0
            ? "text-amber-400"
            : "text-slate-400",
      iconBg:
        overview.privilegeEscalations24h > 2
          ? "bg-red-950/40"
          : overview.privilegeEscalations24h > 0
            ? "bg-amber-950/40"
            : "bg-slate-800/60",
      border:
        overview.privilegeEscalations24h > 2
          ? "border-red-900/40"
          : overview.privilegeEscalations24h > 0
            ? "border-amber-900/40"
            : "border-slate-800/40",
    },
    {
      label: "RBAC Violations",
      sublabel: "Last 24h",
      value: overview.rbacViolations24h,
      icon: Shield,
      color: overview.rbacViolations24h > 0 ? "text-red-400" : "text-slate-400",
      iconBg: overview.rbacViolations24h > 0 ? "bg-red-950/40" : "bg-slate-800/60",
      border: overview.rbacViolations24h > 0 ? "border-red-900/40" : "border-slate-800/40",
    },
    {
      label: "Active Sessions",
      sublabel: "Privileged",
      value: overview.activePrivilegedSessions,
      icon: Users,
      color: "text-blue-400",
      iconBg: "bg-blue-950/40",
      border: "border-blue-900/40",
    },
    {
      label: "Total Events",
      sublabel: "Last 7 days",
      value: overview.totalEvents7d,
      icon: Activity,
      color: "text-slate-400",
      iconBg: "bg-slate-800/60",
      border: "border-slate-800/40",
    },
    {
      label: "Total Events",
      sublabel: "Last 30 days",
      value: overview.totalEvents30d,
      icon: Eye,
      color: "text-slate-400",
      iconBg: "bg-slate-800/60",
      border: "border-slate-800/40",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Posture bar */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-5 flex-wrap">
        <PostureGauge score={overview.securityPostureScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-sm font-bold text-slate-200">Platform Security Posture</h3>
            <ThreatStatusBadge status={overview.platformThreatStatus} />
          </div>
          <div className="flex gap-6 text-xs text-slate-500 flex-wrap">
            <span>
              <span className="font-semibold text-slate-400">{overview.totalEvents24h}</span> events
              24h
            </span>
            <span>
              <span className="font-semibold text-slate-400">{overview.bySeverity.CRITICAL}</span>{" "}
              CRITICAL
            </span>
            <span>
              <span className="font-semibold text-slate-400">{overview.bySeverity.SEVERE}</span>{" "}
              SEVERE
            </span>
            {overview.lastEventAtISO && (
              <span>
                Last threat:{" "}
                <span className="font-semibold text-slate-400">
                  {new Date(overview.lastEventAtISO).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            )}
          </div>
          {/* Severity distribution bar */}
          <div className="mt-3 flex gap-1 items-end h-2">
            {[
              { key: "SEVERE", color: "bg-red-500", value: overview.bySeverity.SEVERE },
              { key: "CRITICAL", color: "bg-orange-500", value: overview.bySeverity.CRITICAL },
              { key: "HIGH", color: "bg-amber-500", value: overview.bySeverity.HIGH },
              { key: "MEDIUM", color: "bg-cyan-500", value: overview.bySeverity.MEDIUM },
              { key: "LOW", color: "bg-slate-600", value: overview.bySeverity.LOW },
            ].map((bar) => {
              const total =
                overview.bySeverity.SEVERE +
                overview.bySeverity.CRITICAL +
                overview.bySeverity.HIGH +
                overview.bySeverity.MEDIUM +
                overview.bySeverity.LOW;
              const pct = total > 0 ? (bar.value / total) * 100 : 0;
              return pct > 0 ? (
                <div
                  key={bar.key}
                  className={`rounded-full h-2 ${bar.color} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${bar.key}: ${bar.value}`}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={`${card.label}-${card.sublabel}`}
              className={`p-4 rounded-xl bg-slate-900/60 border ${card.border} flex items-start gap-3`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xl font-black leading-none ${card.color}`}>
                  {card.value.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-slate-300 mt-0.5 leading-tight">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-600 leading-tight">{card.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
