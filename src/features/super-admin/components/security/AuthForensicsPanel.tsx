"use client";

import type {
  AuthForensicsData,
  AuthForensicEvent,
  BruteForceProfile,
} from "@/types/super-admin-security";
import { ThreatSeverityBadge } from "./ThreatSeverityBadge";
import { Lock, AlertTriangle, ShieldAlert, CheckCircle2, User } from "lucide-react";

interface AuthForensicsPanelProps {
  data: AuthForensicsData;
}

const AUTH_EVENT_TYPE_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: "Login Success",
  LOGIN_FAILURE: "Login Failure",
  LOGOUT: "Logout",
  SESSION_ESTABLISHED: "Session Established",
  SESSION_INVALIDATED: "Session Invalidated",
  OAUTH_FAILURE: "OAuth Failure",
  CREDENTIAL_FAILURE: "Credential Failure",
  STALE_SESSION_DETECTED: "Stale Session",
  EMAIL_MISMATCH: "Email Mismatch",
  ROLE_REVOKED: "Role Revoked",
};

function ThreatLevelBanner({ level }: { level: AuthForensicsData["authThreatLevel"] }) {
  if (level === "NORMAL") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs text-emerald-400 font-semibold">
          Authentication Threat Level: NORMAL — No anomalies detected
        </span>
      </div>
    );
  }

  const isThreaten = level === "THREAT";
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg border ${
        isThreaten ? "bg-red-950/20 border-red-900/40" : "bg-amber-950/20 border-amber-900/40"
      }`}
    >
      <AlertTriangle
        className={`w-4 h-4 shrink-0 ${isThreaten ? "text-red-400" : "text-amber-400"}`}
      />
      <span className={`text-xs font-bold ${isThreaten ? "text-red-400" : "text-amber-400"}`}>
        Authentication Threat Level: {level}
        {isThreaten ? " — Immediate investigation recommended" : " — Monitor closely"}
      </span>
    </div>
  );
}

function BruteForceCard({ profile }: { profile: BruteForceProfile }) {
  return (
    <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 flex items-start gap-3">
      <div className="p-1.5 rounded-md bg-red-950/60 shrink-0">
        <ShieldAlert className="w-4 h-4 text-red-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-bold text-red-300">Brute-Force Detected</span>
          <span className="text-[9px] font-bold text-red-500 bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 rounded-full tracking-wider">
            {profile.failureCount} failures / {profile.windowHours}h
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-slate-500">
          <span>
            Actor: <span className="text-slate-400">{profile.actorId?.slice(0, 12)}…</span>
          </span>
          {profile.ipAddress && (
            <span>
              IP: <span className="text-slate-400 font-mono">{profile.ipAddress}</span>
            </span>
          )}
          <span>
            First:{" "}
            <span className="text-slate-400">
              {new Date(profile.firstAttemptISO).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
          <span>
            Last:{" "}
            <span className="text-slate-400">
              {new Date(profile.lastAttemptISO).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function AuthEventRow({ event }: { event: AuthForensicEvent }) {
  const typeLabel = AUTH_EVENT_TYPE_LABELS[event.authEventType] ?? event.authEventType;
  const isFailure =
    event.authEventType === "LOGIN_FAILURE" ||
    event.authEventType === "CREDENTIAL_FAILURE" ||
    event.authEventType === "OAUTH_FAILURE" ||
    event.authEventType === "EMAIL_MISMATCH" ||
    event.authEventType === "ROLE_REVOKED";

  return (
    <div
      className={`px-4 py-3 flex items-start gap-3 border-b border-slate-800/40 last:border-0 ${
        event.isBruteForce ? "bg-red-950/10" : ""
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
          event.isBruteForce
            ? "bg-red-500 animate-pulse"
            : event.severity === "CRITICAL" || event.severity === "SEVERE"
              ? "bg-orange-500"
              : event.severity === "HIGH"
                ? "bg-amber-400"
                : isFailure
                  ? "bg-cyan-400"
                  : "bg-slate-600"
        }`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[200px]">
            {event.action}
          </span>
          <ThreatSeverityBadge severity={event.severity} size="xs" />
          {event.isBruteForce && (
            <span className="text-[9px] font-bold text-red-400 bg-red-950/50 border border-red-800/40 px-1.5 py-0.5 rounded-full tracking-wider">
              BRUTE FORCE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap text-[10px] text-slate-600">
          <span className="bg-slate-800/60 rounded-full px-1.5 py-0.5">{typeLabel}</span>
          {event.actor && (
            <span className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              {event.actor.email ?? event.actor.id.slice(0, 10)}
            </span>
          )}
          {event.ipAddress && <span className="font-mono">{event.ipAddress}</span>}
          {event.failureReason && <span className="text-slate-700">{event.failureReason}</span>}
          <span>{event.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export function AuthForensicsPanel({ data }: AuthForensicsPanelProps) {
  return (
    <div className="space-y-4">
      <ThreatLevelBanner level={data.authThreatLevel} />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Auth Failures",
            sublabel: "24h",
            value: data.totalAuthFailures24h,
            color: data.totalAuthFailures24h > 5 ? "text-red-400" : "text-slate-300",
          },
          {
            label: "Auth Failures",
            sublabel: "7 days",
            value: data.totalAuthFailures7d,
            color: "text-slate-300",
          },
          {
            label: "OAuth Failures",
            sublabel: "24h",
            value: data.oauthFailures24h,
            color: data.oauthFailures24h > 0 ? "text-amber-400" : "text-slate-300",
          },
          {
            label: "Session Anomalies",
            sublabel: "24h",
            value: data.suspiciousSessionEvents24h,
            color: data.suspiciousSessionEvents24h > 0 ? "text-orange-400" : "text-slate-300",
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

      {/* Brute-force profiles */}
      {data.bruteForceProfiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-red-500 tracking-widest uppercase px-1">
            🔥 Brute-Force Profiles Detected
          </p>
          {data.bruteForceProfiles.map((profile, i) => (
            <BruteForceCard key={`${profile.actorId}-${i}`} profile={profile} />
          ))}
        </div>
      )}

      {/* Auth event feed */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-400">Authentication Event Feed</span>
          </div>
          <span className="text-[10px] text-slate-600">
            Last 7 days · {data.recentAuthEvents.length} events
          </span>
        </div>

        {data.recentAuthEvents.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No authentication events in monitoring window.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {data.recentAuthEvents.slice(0, 15).map((event) => (
              <AuthEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
