/**
 * QuizArena — Enterprise Audit & Compliance Center
 *
 * Sovereign forensic governance and institutional accountability system.
 * Access: SUPER_ADMIN ONLY — server-authoritative RBAC enforcement.
 *
 * Architecture:
 * - Server-side data aggregation via Promise.all()
 * - Immutable audit trail (append-only enforcement)
 * - Five-tier severity classification (LOW → MEDIUM → HIGH → CRITICAL → SEVERE)
 * - Forensic-grade event chain visibility
 * - Governance anomaly detection engine
 * - Security & authorization forensics
 * - Role change and setting change audit chains
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/features/super-admin/services/governance";
import { logSuperAdminAudit } from "@/features/super-admin/services/audit";
import { getCompliancePageData } from "@/features/super-admin/services/compliance";
import { ROUTES } from '@/constants/routes';
import { ComplianceOverviewCards } from "@/features/super-admin/components/compliance/ComplianceOverviewCards";
import { GovernanceTimelinePanel } from "@/features/super-admin/components/compliance/GovernanceTimelinePanel";
import { SecurityForensicsPanel } from "@/features/super-admin/components/compliance/SecurityForensicsPanel";
import { AnomalyEnginePanel } from "@/features/super-admin/components/compliance/AnomalyEnginePanel";
import { GovernanceChainPanel } from "@/features/super-admin/components/compliance/GovernanceChainPanel";
import {
  Lock,
  ClipboardCheck,
  Shield,
  Radar,
  Activity,
  Key,
  Download,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "Compliance Center — QuizArena Sovereign",
  description:
    "Enterprise audit & forensic governance center. Sovereign compliance infrastructure for Super Admin.",
};

// Force dynamic rendering — compliance data must be real-time
export const dynamic = "force-dynamic";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  iconColor = "text-blue-400",
  iconBg = "bg-blue-950/40",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  badge?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className={`p-2.5 rounded-lg shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base font-bold text-slate-100">{title}</h2>
          {badge && (
            <span className="text-[9px] font-bold text-slate-500 bg-slate-800 border border-slate-700/50 rounded-full px-2 py-0.5 tracking-wider uppercase">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default async function SuperAdminCompliancePage() {
  // ── SUPER_ADMIN Sovereignty Validation ──────────────────────────────────────
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  const ctx = result.context;

  // ── Audit Access ────────────────────────────────────────────────────────────
  await logSuperAdminAudit({
    actorId: ctx.userId,
    actorRole: ctx.role,
    actorEmail: ctx.email,
    action: "COMPLIANCE_CENTER_ACCESS",
    category: "COMPLIANCE",
    riskSeverity: "MEDIUM",
    infrastructureImpact: "Enterprise Audit & Compliance Center accessed — read-only forensic view",
    timestamp: new Date(),
  });

  // ── Server-Side Data Aggregation ────────────────────────────────────────────
  // All governance intelligence computed server-side via Promise.all()
  const data = await getCompliancePageData({ limit: 50 });

  return (
    <div className="space-y-10">
      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-800/40 rounded-full">
            <Lock className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
              Sovereign Compliance
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/60 border border-slate-700/40 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
              IMMUTABLE AUDIT ENFORCED
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
              Enterprise Audit &amp; Compliance Center
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
              Forensic-grade governance accountability, institutional audit trails, security
              forensics, and compliance intelligence. Sovereign access — SUPER_ADMIN only.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Export foundation (architecture prepared) */}
            <button
              disabled
              title="Export foundation prepared — coming in future phase"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-600 text-xs font-medium cursor-not-allowed opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/40">
              <RefreshCw className="w-3 h-3 text-slate-600" />
              <span className="text-[10px] text-slate-600">
                Aggregated{" "}
                {new Date(data.lastAggregatedISO).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: COMPLIANCE OVERVIEW ─────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={ClipboardCheck}
          title="Compliance Overview"
          subtitle="Aggregate governance metrics, severity distribution, and enforcement status"
          badge="Real-time"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-950/40"
        />
        <ComplianceOverviewCards overview={data.overview} />
      </section>

      {/* ── SECTION 2: GOVERNANCE ANOMALY ENGINE ───────────────────────────── */}
      <section>
        <SectionHeader
          icon={Radar}
          title="Governance Anomaly Engine"
          subtitle="Proactive institutional risk detection — pattern analysis on live governance data"
          badge={data.anomalies.length > 0 ? `${data.anomalies.length} DETECTED` : "CLEAR"}
          iconColor="text-violet-400"
          iconBg="bg-violet-950/40"
        />
        <AnomalyEnginePanel anomalies={data.anomalies} />
      </section>

      {/* ── SECTION 3: SECURITY FORENSICS ──────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Shield}
          title="Security & Authorization Forensics"
          subtitle="CRITICAL/HIGH events, auth anomalies, RBAC violations, infrastructure overrides"
          badge={`THREAT: ${data.securityForensics.threatLevel}`}
          iconColor="text-red-400"
          iconBg="bg-red-950/40"
        />
        <SecurityForensicsPanel data={data.securityForensics} />
      </section>

      {/* ── SECTION 4: GOVERNANCE TIMELINE ─────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Activity}
          title="Governance Timeline"
          subtitle="Chronological forensic audit trail — all governance events with full actor identity"
          badge={`${data.timeline.totalCount.toLocaleString()} total events`}
          iconColor="text-blue-400"
          iconBg="bg-blue-950/40"
        />
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
          <GovernanceTimelinePanel timeline={data.timeline} />
        </div>
      </section>

      {/* ── SECTION 5: GOVERNANCE CHAIN ────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Key}
          title="Governance Chain Reconstruction"
          subtitle="Role escalation forensics and platform setting audit chains with actor-target mapping"
          badge="Forensic"
          iconColor="text-amber-400"
          iconBg="bg-amber-950/40"
        />
        <GovernanceChainPanel
          roleChanges={data.recentRoleChanges}
          settingAudits={data.recentSettingAudits}
        />
      </section>

      {/* ── COMPLIANCE FOOTER ──────────────────────────────────────────────── */}
      <section>
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Export Architecture
              </p>
              <p className="text-xs text-slate-500">PDF Reports · Forensic Snapshots</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Foundation prepared — Phase 7.x</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                SIEM Integration
              </p>
              <p className="text-xs text-slate-500">Webhook · Log Forwarding</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Architecture extensible</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                AI Anomaly Detection
              </p>
              <p className="text-xs text-slate-500">ML Governance Intelligence</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Future scalability ready</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Retention Policies
              </p>
              <p className="text-xs text-slate-500">Regulatory Compliance</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Governance framework ready</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[10px] text-slate-700">
              All audit data is append-only and immutable. No delete controls are exposed. This
              system is server-authoritative — all compliance queries run server-side only.
            </p>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              <span className="text-[10px] text-slate-600 font-bold">
                SUPER_ADMIN · Sovereign Access · Phase 7.6
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
