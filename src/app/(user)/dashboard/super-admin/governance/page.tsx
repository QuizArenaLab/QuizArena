export const dynamic = "force-dynamic";

/**
 * QuizArena — Governance Hub
 *
 * Role authority, privilege management, RBAC hierarchy.
 * Access: SUPER_ADMIN ONLY.
 *
 * Phase 7.1: Foundation stub linking to existing role management.
 */

import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/features/super-admin/services/governance";
import { logSuperAdminAudit } from "@/features/super-admin/services/audit";
import { ROUTES } from '@/constants/routes';
import Link from "next/link";
import { Crown, Shield, Users, ArrowRight, Lock, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Governance — QuizArena Sovereign",
  description: "Role authority and privilege management for Super Admin.",
};

export default async function SuperAdminGovernancePage() {
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  await logSuperAdminAudit({
    actorId: result.context.userId,
    actorRole: result.context.role,
    actorEmail: result.context.email,
    action: "GOVERNANCE_HUB_ACCESS",
    category: "ROLE_GOVERNANCE",
    riskSeverity: "MEDIUM",
    infrastructureImpact: "Governance section accessed",
    timestamp: new Date(),
  });

  const govSections = [
    {
      icon: Crown,
      label: "Role Management",
      description: "Promote, demote, and manage privileged roles across the platform hierarchy.",
      href: ROUTES.SUPER_ADMIN.ROLES,
      available: true,
      severity: "CRITICAL",
    },
    {
      icon: Shield,
      label: "Intelligence",
      description: "Strategic intelligence, RBAC analytics, and governance insights.",
      href: ROUTES.SUPER_ADMIN.INTELLIGENCE,
      available: true,
      severity: "HIGH",
    },
    {
      icon: Users,
      label: "Admin Lifecycle",
      description: "Admin account creation, privilege review, and authority management.",
      href: null,
      available: false,
    },
    {
      icon: BarChart3,
      label: "Privilege Analytics",
      description: "Role distribution analytics, escalation history, and governance metrics.",
      href: null,
      available: false,
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
              Governance
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Governance</h1>
        <p className="text-slate-500 text-sm">
          Role authority, privilege management, and RBAC hierarchy control.
        </p>
      </div>

      {/* RBAC Hierarchy Display */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Authority Hierarchy
        </h2>
        <div className="space-y-2">
          {[
            {
              role: "SUPER_ADMIN",
              level: 3,
              color: "text-red-400",
              bg: "bg-red-950/40",
              border: "border-red-800/40",
              label: "Platform Sovereignty",
            },
            {
              role: "ADMIN",
              level: 2,
              color: "text-amber-400",
              bg: "bg-amber-950/40",
              border: "border-amber-800/40",
              label: "Platform Operations",
            },
            {
              role: "MODERATOR",
              level: 1,
              color: "text-blue-400",
              bg: "bg-blue-950/40",
              border: "border-blue-800/40",
              label: "Content Management",
            },
            {
              role: "USER",
              level: 0,
              color: "text-slate-400",
              bg: "bg-slate-800/40",
              border: "border-slate-700/40",
              label: "Platform Access",
            },
          ].map((item, i) => (
            <div
              key={item.role}
              className={`flex items-center gap-4 p-3 rounded-lg border ${item.bg} ${item.border}`}
              style={{ marginLeft: `${(3 - i) * 0}px` }}
            >
              <div className={`text-xs font-bold font-mono ${item.color} w-20 shrink-0`}>
                {item.role}
              </div>
              <div className="flex-1 text-xs text-slate-500">{item.label}</div>
              <div className={`text-xs font-bold ${item.color} tabular-nums`}>
                Level {item.level}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-700 mt-3">
          Lower roles cannot escalate upward. Hierarchy is server-authoritative and immutable.
        </p>
      </div>

      {/* Governance Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {govSections.map((item) => {
          const Icon = item.icon;
          const card = (
            <div
              className={`p-5 rounded-xl bg-slate-900/60 border transition-all duration-200 ${
                item.available
                  ? "border-purple-900/40 hover:border-purple-700/60 cursor-pointer"
                  : "border-slate-800/40 opacity-70"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${item.available ? "bg-purple-950/40" : "bg-slate-800/40"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${item.available ? "text-purple-400" : "text-slate-600"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-200">{item.label}</h3>
                    {item.severity && item.available && (
                      <span
                        className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                          item.severity === "CRITICAL"
                            ? "text-red-400 bg-red-950/40"
                            : "text-amber-400 bg-amber-950/40"
                        }`}
                      >
                        {item.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
                    {item.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2.5 py-1 ${
                      item.available
                        ? "text-purple-400 bg-purple-950/40"
                        : "text-slate-600 bg-slate-800"
                    }`}
                  >
                    <ArrowRight className="w-3 h-3" />
                    {item.available ? "Access System" : "Coming Phase 7.x"}
                  </span>
                </div>
              </div>
            </div>
          );

          return item.available && item.href ? (
            <Link key={item.label} href={item.href}>
              {card}
            </Link>
          ) : (
            <div key={item.label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
