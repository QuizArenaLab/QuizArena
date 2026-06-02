/**
 * QuizArena — Platform Controls Hub
 *
 * Feature sovereignty, platform overrides, feature flags.
 * Access: SUPER_ADMIN ONLY.
 *
 * Phase 7.1: Foundation stub.
 */

import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/features/super-admin/services/governance";
import { logSuperAdminAudit } from "@/features/super-admin/services/audit";
import { ROUTES } from '@/constants/routes';
import { Sliders, ToggleLeft, Wrench, Layers, ArrowRight, Lock, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Platform Controls — QuizArena Sovereign",
  description: "Feature sovereignty and platform control for Super Admin.",
};

export default async function SuperAdminPlatformControlsPage() {
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  await logSuperAdminAudit({
    actorId: result.context.userId,
    actorRole: result.context.role,
    actorEmail: result.context.email,
    action: "PLATFORM_CONTROLS_HUB_ACCESS",
    category: "PLATFORM_CONTROLS",
    riskSeverity: "MEDIUM",
    infrastructureImpact: "Platform controls section accessed",
    timestamp: new Date(),
  });

  const controls = [
    {
      icon: ToggleLeft,
      label: "Feature Flags",
      description: "Platform-wide feature flag management, rollouts, and A/B testing controls.",
      risk: "HIGH",
      color: "text-blue-400",
      bg: "bg-blue-950/40",
      border: "border-blue-900/30",
    },
    {
      icon: Wrench,
      label: "Platform Overrides",
      description: "Emergency platform behavior overrides requiring high-risk confirmation.",
      risk: "CRITICAL",
      color: "text-red-400",
      bg: "bg-red-950/40",
      border: "border-red-900/30",
    },
    {
      icon: Layers,
      label: "Tier Controls",
      description: "Subscription tier feature gating, plan capability management.",
      risk: "HIGH",
      color: "text-purple-400",
      bg: "bg-purple-950/40",
      border: "border-purple-900/30",
    },
    {
      icon: Sliders,
      label: "System Toggles",
      description: "Platform-wide operational toggles — registration, challenges, leaderboard.",
      risk: "HIGH",
      color: "text-amber-400",
      bg: "bg-amber-950/40",
      border: "border-amber-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-800/40 rounded-full">
            <Lock className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
              Platform Controls
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Platform Controls</h1>
        <p className="text-slate-500 text-sm">
          Feature sovereignty, platform overrides, and operational toggles.
        </p>
      </div>

      {/* High-Risk Warning */}
      <div className="flex items-start gap-3 p-5 bg-amber-950/20 border border-amber-800/30 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-300">High-Risk Authority Area</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Platform controls affect all users simultaneously. Feature flag changes, platform
            overrides, and system toggles are classified as HIGH or CRITICAL risk operations. All
            actions require explicit confirmation and are fully audited.
          </p>
        </div>
      </div>

      {/* Foundation Notice */}
      <div className="flex items-start gap-3 p-5 bg-blue-950/20 border border-blue-800/30 rounded-xl">
        <Sliders className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-300">Phase 7.1 — Foundation Architecture</p>
          <p className="text-xs text-blue-600 mt-1 leading-relaxed">
            Platform controls authority boundary is established. High-risk action infrastructure is
            operational. Full feature flag management and platform override systems will be built in
            Phase 7.x Platform Controls.
          </p>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {controls.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-5 rounded-xl bg-slate-900/60 border ${item.border} opacity-75`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-200">{item.label}</h3>
                    <span
                      className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                        item.risk === "CRITICAL"
                          ? "text-red-400 bg-red-950/40"
                          : "text-amber-400 bg-amber-950/40"
                      }`}
                    >
                      {item.risk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-800 rounded-full px-2.5 py-1">
                    <ArrowRight className="w-3 h-3" />
                    Coming Phase 7.x
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
