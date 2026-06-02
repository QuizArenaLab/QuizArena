"use client";

import type { SecurityAlert } from "@/types/super-admin-security";
import { ThreatSeverityBadge } from "./ThreatSeverityBadge";
import { Zap, AlertTriangle, Shield, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

interface SecurityAlertCenterProps {
  alerts: SecurityAlert[];
}

const ALERT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BRUTE_FORCE_DETECTED: Lock,
  PRIVILEGE_ESCALATION_ATTEMPT: ArrowRight,
  SUSPICIOUS_ADMIN_ACTIVITY: AlertTriangle,
  GOVERNANCE_ABUSE_DETECTED: Shield,
  SESSION_ANOMALY_DETECTED: Zap,
  REPEATED_AUTH_FAILURE: Lock,
  INFRASTRUCTURE_THREAT: AlertTriangle,
  SUPER_ADMIN_ATTACK_ATTEMPT: Shield,
  RBAC_VIOLATION_CLUSTER: Shield,
  OPERATIONAL_SPIKE: Zap,
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  BRUTE_FORCE_DETECTED: "Brute-Force",
  PRIVILEGE_ESCALATION_ATTEMPT: "Privilege Escalation",
  SUSPICIOUS_ADMIN_ACTIVITY: "Suspicious Admin",
  GOVERNANCE_ABUSE_DETECTED: "Governance Abuse",
  SESSION_ANOMALY_DETECTED: "Session Anomaly",
  REPEATED_AUTH_FAILURE: "Auth Failure",
  INFRASTRUCTURE_THREAT: "Infrastructure",
  SUPER_ADMIN_ATTACK_ATTEMPT: "Sovereign Attack",
  RBAC_VIOLATION_CLUSTER: "RBAC Cluster",
  OPERATIONAL_SPIKE: "Op. Spike",
};

function AlertCard({ alert }: { alert: SecurityAlert }) {
  const Icon = ALERT_TYPE_ICONS[alert.alertType] ?? AlertTriangle;
  const typeLabel = ALERT_TYPE_LABELS[alert.alertType] ?? alert.alertType;

  const urgencyBorder = alert.requiresImmediateAction
    ? "border-red-800/60 bg-red-950/10"
    : "border-slate-800/60 bg-slate-900/60";

  return (
    <div className={`p-4 rounded-xl border ${urgencyBorder} flex items-start gap-3 transition-all`}>
      {/* Severity icon */}
      <div
        className={`p-2 rounded-lg shrink-0 ${
          alert.severity === "SEVERE" || alert.severity === "CRITICAL"
            ? "bg-red-950/50"
            : alert.severity === "HIGH"
              ? "bg-amber-950/40"
              : "bg-slate-800/60"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${
            alert.severity === "SEVERE" || alert.severity === "CRITICAL"
              ? "text-red-400"
              : alert.severity === "HIGH"
                ? "text-amber-400"
                : "text-slate-400"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-200 leading-tight">{alert.title}</span>
            {alert.requiresImmediateAction && (
              <span className="text-[9px] font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-1.5 py-0.5 rounded-full tracking-wider uppercase">
                Immediate Action
              </span>
            )}
          </div>
          <ThreatSeverityBadge severity={alert.severity} size="xs" />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-2">{alert.description}</p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-[10px] text-slate-600">
            <span className="bg-slate-800 rounded-full px-2 py-0.5 font-semibold text-slate-500">
              {typeLabel}
            </span>
            <span>
              {alert.eventCount} event{alert.eventCount !== 1 ? "s" : ""}
            </span>
            <span>{alert.timeAgo}</span>
          </div>
          <span className="text-[10px] text-slate-600 flex items-center gap-1">
            <ArrowRight className="w-2.5 h-2.5" />
            {alert.investigationWorkflow}
          </span>
        </div>
      </div>
    </div>
  );
}

export function SecurityAlertCenter({ alerts }: SecurityAlertCenterProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-slate-900/40 border border-emerald-900/30 flex flex-col items-center justify-center gap-3 text-center">
        <div className="p-3 rounded-full bg-emerald-950/40">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-300">No Active Alerts</p>
          <p className="text-xs text-slate-600 mt-0.5">
            All security systems within normal operating parameters.
          </p>
        </div>
      </div>
    );
  }

  const immediateAlerts = alerts.filter((a) => a.requiresImmediateAction);
  const standardAlerts = alerts.filter((a) => !a.requiresImmediateAction);

  return (
    <div className="space-y-3">
      {immediateAlerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-red-500 tracking-widest uppercase px-1">
            ⚡ Immediate Action Required
          </p>
          {immediateAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {standardAlerts.length > 0 && (
        <div className="space-y-2">
          {immediateAlerts.length > 0 && (
            <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase px-1 mt-3">
              Active Alerts
            </p>
          )}
          {standardAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
