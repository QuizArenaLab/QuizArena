import { redirect } from "next/navigation";
import { validateSuperAdmin, logSuperAdminAudit } from "@/lib/super-admin";
import { getSOCPageData } from "@/lib/super-admin/security";
import { SecurityOverviewCards } from "@/components/super-admin/security/SecurityOverviewCards";
import { SecurityAlertCenter } from "@/components/super-admin/security/SecurityAlertCenter";
import { AuthForensicsPanel } from "@/components/super-admin/security/AuthForensicsPanel";
import { PrivilegeEscalationPanel } from "@/components/super-admin/security/PrivilegeEscalationPanel";
import { ThreatTimelinePanel } from "@/components/super-admin/security/ThreatTimelinePanel";
import { SuspiciousActivityPanel } from "@/components/super-admin/security/SuspiciousActivityPanel";
import { SessionGovernancePanel } from "@/components/super-admin/security/SessionGovernancePanel";

// Real-time security dashboard — do not cache
export const dynamic = "force-dynamic";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold tracking-widest text-slate-300 uppercase">{title}</h2>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}

export default async function SecurityOperationsCenterPage() {
  const result = await validateSuperAdmin();
  if (!result.authorized || !result.context) {
    redirect("/dashboard");
  }
  const ctx = result.context;

  // Log sovereign access to the SOC
  await logSuperAdminAudit({
    actorId: ctx.userId,
    actorRole: ctx.role,
    actorEmail: ctx.email,
    action: "SECURITY_SOC_ACCESS",
    category: "SECURITY",
    riskSeverity: "LOW",
    infrastructureImpact: "Security Operations Center accessed — read-only view",
    timestamp: new Date(),
  });

  // Fetch all pre-computed SOC data in parallel
  const data = await getSOCPageData();

  return (
    <div className="space-y-10">
      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-800/40 rounded-full">
            <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
              Sovereign Security
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
              Security Operations Center
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
              Sovereign cyber-security, threat-detection, and platform-defense layer.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12 pb-12">
        {/* 1. Overview KPIs */}
        <section>
          <SectionHeader
            title="Platform Posture & KPIs"
            description="Real-time security metrics and global threat indicators."
          />
          <SecurityOverviewCards overview={data.overview} />
        </section>

        {/* 2. Alert Center */}
        <section>
          <SectionHeader
            title="Security Alert Center"
            description="Actionable intelligence derived from multi-vector threat signals."
          />
          <SecurityAlertCenter alerts={data.alerts} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3. Auth Forensics */}
          <section className="space-y-4">
            <SectionHeader
              title="Authentication Forensics"
              description="Login failures, brute-force patterns, and credential threats."
            />
            <AuthForensicsPanel data={data.authForensics} />
          </section>

          {/* 4. Privilege Escalation */}
          <section className="space-y-4">
            <SectionHeader
              title="Privilege Escalation & RBAC"
              description="Role change forensics and authorization bypass attempts."
            />
            <PrivilegeEscalationPanel data={data.privilegeEscalation} />
          </section>
        </div>

        {/* 5. Suspicious Activity Intelligence */}
        <section>
          <SectionHeader
            title="Suspicious Activity Intelligence"
            description="Anomaly-detection engine for operational threat vectors."
          />
          <SuspiciousActivityPanel data={data.suspiciousActivity} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 6. Threat Timeline */}
          <section className="space-y-4">
            <SectionHeader
              title="Threat Event Timeline"
              description="Chronological reconstruction of security incidents."
            />
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden h-[600px] overflow-y-auto custom-scrollbar">
              <ThreatTimelinePanel timeline={data.threatTimeline} />
            </div>
          </section>

          {/* 7. Session Governance */}
          <section className="space-y-4">
            <SectionHeader
              title="Session Governance"
              description="Risk-scoring and monitoring for active privileged sessions."
            />
            <SessionGovernancePanel data={data.sessionGovernance} />
          </section>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-600 font-mono">
            SOC INTELLIGENCE LAST COMPUTED: {new Date(data.lastAggregatedISO).toLocaleString()} UTC
            <br />
            INFRASTRUCTURE: SERVER-SIDE ONLY · HYDRATION SAFE
          </p>
        </div>
      </div>
    </div>
  );
}
