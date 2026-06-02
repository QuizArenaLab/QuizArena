/**
 * QuizArena — Governance Anomaly Engine Panel
 *
 * Proactive anomaly detection display:
 * - Detected governance anomalies
 * - Severity classification
 * - Actor identity
 * - Detection window + event counts
 * - Investigation workflow links
 *
 * Server component — fully pre-rendered.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { GovernanceAnomaly } from "@/types/super-admin-compliance";
import { SeverityBadge } from "./SeverityBadge";
import { Radar, AlertTriangle, User, Clock, ChevronRight, CheckCircle2 } from "lucide-react";

interface AnomalyEngineProps {
  anomalies: GovernanceAnomaly[];
}

const ANOMALY_TYPE_LABELS: Record<string, string> = {
  REPEATED_CRITICAL_ACTOR: "Repeated Critical Actor",
  ROLE_ESCALATION_SPIKE: "Role Escalation Spike",
  INFRASTRUCTURE_OVERRIDE_SPIKE: "Infrastructure Override Cluster",
  UNUSUAL_GOVERNANCE_VOLUME: "Unusual Event Volume",
  SUSPICIOUS_AUTH_PATTERN: "Suspicious Auth Pattern",
  PERMISSION_FAILURE_CLUSTER: "Blocked Operation Cluster",
  RAPID_SETTING_CHANGES: "Rapid Setting Changes",
  OFF_HOURS_GOVERNANCE_ACTIVITY: "Off-Hours Governance Activity",
};

function AnomalyCard({ anomaly }: { anomaly: GovernanceAnomaly }) {
  const isSevere = anomaly.severity === "SEVERE" || anomaly.severity === "CRITICAL";

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        anomaly.severity === "SEVERE"
          ? "bg-red-950/15 border-red-900/40"
          : anomaly.severity === "CRITICAL"
            ? "bg-orange-950/15 border-orange-900/30"
            : anomaly.severity === "HIGH"
              ? "bg-amber-950/15 border-amber-900/25"
              : "bg-slate-900/60 border-slate-800/60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            anomaly.severity === "SEVERE"
              ? "bg-red-950/40"
              : anomaly.severity === "CRITICAL"
                ? "bg-orange-950/40"
                : "bg-amber-950/40"
          }`}
        >
          <Radar
            className={`w-4 h-4 ${
              anomaly.severity === "SEVERE"
                ? "text-red-400"
                : anomaly.severity === "CRITICAL"
                  ? "text-orange-400"
                  : "text-amber-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-bold text-slate-200">{anomaly.title}</h3>
            <SeverityBadge severity={anomaly.severity} size="xs" />
          </div>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
            {ANOMALY_TYPE_LABELS[anomaly.type] ?? anomaly.type}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{anomaly.description}</p>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] text-slate-500">
            <span className="font-bold text-slate-300">{anomaly.eventCount}</span> events
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] text-slate-500">{anomaly.detectionWindow}</span>
        </div>
        {anomaly.actor && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-600" />
            <span className="text-[10px] text-slate-500">
              {anomaly.actor.name ?? anomaly.actor.email ?? anomaly.actor.id.slice(0, 8)}
            </span>
          </div>
        )}
      </div>

      {/* Investigation action */}
      <div
        className={`flex items-center gap-2 p-2.5 rounded-lg ${
          isSevere
            ? "bg-slate-900/60 border border-slate-700/40"
            : "bg-slate-900/40 border border-slate-800/40"
        }`}
      >
        <ChevronRight
          className={`w-3 h-3 shrink-0 ${
            anomaly.severity === "SEVERE"
              ? "text-red-400"
              : anomaly.severity === "CRITICAL"
                ? "text-orange-400"
                : "text-amber-400"
          }`}
        />
        <p className="text-[10px] font-medium text-slate-400">{anomaly.investigationAction}</p>
      </div>
    </div>
  );
}

export function AnomalyEnginePanel({ anomalies }: AnomalyEngineProps) {
  if (anomalies.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-emerald-950/10 border border-emerald-900/20 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
        <p className="text-sm font-bold text-emerald-300">No Governance Anomalies Detected</p>
        <p className="text-xs text-emerald-800 mt-1">
          Platform governance patterns are within normal operational bounds. The anomaly engine
          continues monitoring in the background.
        </p>
      </div>
    );
  }

  const severeCount = anomalies.filter(
    (a) => a.severity === "SEVERE" || a.severity === "CRITICAL"
  ).length;

  return (
    <div className="space-y-4">
      {/* Anomaly alert summary */}
      {severeCount > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/20 border border-red-900/30">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-red-300">
              {severeCount} Critical Anomaly{severeCount > 1 ? "s" : ""} Detected
            </p>
            <p className="text-[11px] text-red-800 mt-0.5">
              Immediate investigation recommended. Review each anomaly below and follow the
              investigation workflow.
            </p>
          </div>
        </div>
      )}

      {/* Anomaly cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {anomalies.map((anomaly) => (
          <AnomalyCard key={anomaly.id} anomaly={anomaly} />
        ))}
      </div>

      <p className="text-[10px] text-slate-700 text-center">
        Anomaly detection runs on each page load. Detection patterns: repeated critical actors, role
        escalation spikes, infrastructure clusters, governance volume spikes, blocked operations.
      </p>
    </div>
  );
}
