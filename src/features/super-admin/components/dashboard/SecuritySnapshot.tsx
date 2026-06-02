import type { SecuritySnapshotData } from "@/types/super-admin-dashboard";
import { ShieldAlert, Fingerprint, Users, Activity, Lock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';

export function SecuritySnapshot({ data }: { data: SecuritySnapshotData }) {
  let threatColor = "text-emerald-400";
  let threatBg = "bg-emerald-950/20";
  let threatBorder = "border-emerald-900/40";

  if (data.threatLevel === "CRITICAL") {
    threatColor = "text-red-400";
    threatBg = "bg-red-950/20";
    threatBorder = "border-red-900/40";
  } else if (data.threatLevel === "HIGH") {
    threatColor = "text-amber-400";
    threatBg = "bg-amber-950/20";
    threatBorder = "border-amber-900/40";
  } else if (data.threatLevel === "ELEVATED") {
    threatColor = "text-blue-400";
    threatBg = "bg-blue-950/20";
    threatBorder = "border-blue-900/40";
  }

  const items = [
    { label: "Suspicious Activity", value: data.suspiciousActivityCount, icon: Fingerprint },
    { label: "Escalation Attempts", value: data.roleEscalationAttempts, icon: Users },
    { label: "Failed Auth Attempts", value: data.failedLogins24h, icon: Lock },
    { label: "Abnormal Events", value: data.abnormalModerationEvents, icon: Activity },
  ];

  return (
    <div
      className={`p-6 rounded-2xl bg-slate-900/60 border ${threatBorder} space-y-6 relative overflow-hidden`}
    >
      {/* Background threat glow */}
      {data.threatLevel !== "LOW" && (
        <div
          className={`absolute top-0 right-0 w-32 h-32 ${threatBg} blur-3xl rounded-full opacity-50`}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${threatBg}`}>
            <ShieldAlert className={`w-5 h-5 ${threatColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">Security Posture</h3>
            <p className={`text-xs font-semibold ${threatColor}`}>
              Threat Level: {data.threatLevel}
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.SUPER_ADMIN.SECURITY}
          className={`text-xs font-semibold ${threatColor} hover:opacity-80 transition-opacity`}
        >
          Security Center &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-500">
              <item.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
