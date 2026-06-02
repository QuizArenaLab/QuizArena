"use client";

import type {
  SuspiciousActivityData,
  SuspiciousActorProfile,
  SuspiciousPattern,
} from "@/types/super-admin-security";
import { CheckCircle2, User, AlertTriangle, ArrowRight } from "lucide-react";

interface SuspiciousActivityPanelProps {
  data: SuspiciousActivityData;
}

const PATTERN_LABELS: Record<SuspiciousPattern, string> = {
  REPEATED_AUTH_FAILURE: "Repeated Auth Failure",
  REPEATED_PERMISSION_DENIED: "Repeated Permission Denied",
  OPERATIONAL_SPIKE: "Operational Spike",
  ABNORMAL_ADMIN_HOURS: "Abnormal Admin Hours",
  ABNORMAL_MODERATION_VOLUME: "Abnormal Moderation Volume",
  HIGH_RISK_SEQUENCE: "High-Risk Sequence",
  GOVERNANCE_FREQUENCY_ANOMALY: "Governance Frequency Anomaly",
};

const PATTERN_COLORS: Record<SuspiciousPattern, string> = {
  REPEATED_AUTH_FAILURE: "text-red-400 bg-red-950/40 border-red-800/40",
  REPEATED_PERMISSION_DENIED: "text-orange-400 bg-orange-950/40 border-orange-800/40",
  OPERATIONAL_SPIKE: "text-amber-400 bg-amber-950/40 border-amber-800/40",
  ABNORMAL_ADMIN_HOURS: "text-purple-400 bg-purple-950/40 border-purple-800/40",
  ABNORMAL_MODERATION_VOLUME: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40",
  HIGH_RISK_SEQUENCE: "text-red-400 bg-red-950/40 border-red-800/40",
  GOVERNANCE_FREQUENCY_ANOMALY: "text-amber-400 bg-amber-950/40 border-amber-800/40",
};

function RiskScoreBar({
  score,
  level,
}: {
  score: number;
  level: SuspiciousActorProfile["riskLevel"];
}) {
  const barColor =
    level === "CRITICAL"
      ? "bg-red-500"
      : level === "HIGH"
        ? "bg-orange-400"
        : level === "MEDIUM"
          ? "bg-amber-400"
          : "bg-slate-600";

  const textColor =
    level === "CRITICAL"
      ? "text-red-400"
      : level === "HIGH"
        ? "text-orange-400"
        : level === "MEDIUM"
          ? "text-amber-400"
          : "text-slate-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${textColor}`}>{score}</span>
    </div>
  );
}

function ActorProfileCard({ profile }: { profile: SuspiciousActorProfile }) {
  const riskBorder =
    profile.riskLevel === "CRITICAL"
      ? "border-red-800/60 bg-red-950/10"
      : profile.riskLevel === "HIGH"
        ? "border-orange-800/50 bg-orange-950/10"
        : "border-slate-800/60 bg-slate-900/60";

  const riskLabel =
    profile.riskLevel === "CRITICAL"
      ? "text-red-400"
      : profile.riskLevel === "HIGH"
        ? "text-orange-400"
        : profile.riskLevel === "MEDIUM"
          ? "text-amber-400"
          : "text-slate-400";

  return (
    <div className={`p-4 rounded-xl border ${riskBorder} space-y-3`}>
      {/* Actor identity */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
              {profile.actor.name ?? profile.actor.email ?? profile.actor.id.slice(0, 12)}
            </p>
            <p className="text-[10px] text-slate-600 truncate">
              {profile.actor.email ?? profile.actor.id}
            </p>
          </div>
        </div>
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
            profile.riskLevel === "CRITICAL"
              ? "text-red-400 bg-red-950/40 border-red-800/40"
              : profile.riskLevel === "HIGH"
                ? "text-orange-400 bg-orange-950/40 border-orange-800/40"
                : profile.riskLevel === "MEDIUM"
                  ? "text-amber-400 bg-amber-950/40 border-amber-800/40"
                  : "text-slate-500 bg-slate-800/60 border-slate-700/50"
          }`}
        >
          {profile.riskLevel} RISK
        </span>
      </div>

      {/* Risk score */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-600">Risk Score</span>
          <span className={`text-[10px] font-bold ${riskLabel}`}>
            {profile.anomalyCount} anomalies
          </span>
        </div>
        <RiskScoreBar score={profile.riskScore} level={profile.riskLevel} />
      </div>

      {/* Patterns */}
      <div className="flex flex-wrap gap-1.5">
        {profile.patterns.map((pattern) => (
          <span
            key={pattern}
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${PATTERN_COLORS[pattern]}`}
          >
            {PATTERN_LABELS[pattern]}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-[10px] text-slate-600 leading-relaxed">{profile.description}</p>

      {/* Investigation workflow */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
        <ArrowRight className="w-2.5 h-2.5 shrink-0" />
        <span>{profile.investigationWorkflow}</span>
      </div>
    </div>
  );
}

export function SuspiciousActivityPanel({ data }: SuspiciousActivityPanelProps) {
  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Anomalies Detected",
            value: data.totalAnomaliesDetected,
            color: data.totalAnomaliesDetected > 0 ? "text-amber-400" : "text-slate-300",
          },
          {
            label: "Suspicious Actors",
            value: data.suspiciousActors.length,
            color: data.suspiciousActors.length > 0 ? "text-orange-400" : "text-slate-300",
          },
          {
            label: "High-Risk Actors",
            value: data.highRiskActorCount,
            color: data.highRiskActorCount > 0 ? "text-red-400" : "text-slate-300",
          },
          {
            label: "Op. Spikes",
            value: data.operationalSpikesDetected,
            color: data.operationalSpikesDetected > 0 ? "text-amber-400" : "text-slate-300",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/40"
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actor profiles */}
      {data.suspiciousActors.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-900/40 border border-emerald-900/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="p-3 rounded-full bg-emerald-950/40">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">No Suspicious Actors Detected</p>
            <p className="text-xs text-slate-600 mt-0.5">
              No anomalous patterns detected in the monitoring window.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">
              Suspicious Actor Profiles
            </span>
          </div>
          {data.suspiciousActors.map((profile) => (
            <ActorProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {/* Analysis timestamp */}
      <p className="text-[10px] text-slate-700 text-right">
        Analysis computed:{" "}
        {new Date(data.lastAnalysisISO).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </p>
    </div>
  );
}
