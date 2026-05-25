/**
 * QuizArena — Super Admin Sovereign Dashboard
 *
 * The strategic platform command center.
 * Access: SUPER_ADMIN ONLY.
 */

import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/lib/super-admin/governance";
import { ROUTES } from "@/lib/routes";
import { getSovereignDashboardData } from "@/lib/super-admin/dashboard";
import { SovereignCommandHeader } from "@/components/super-admin/dashboard/SovereignCommandHeader";
import { SovereignMetricCard } from "@/components/super-admin/dashboard/SovereignMetricCard";
import { InfrastructureHealthGrid } from "@/components/super-admin/dashboard/InfrastructureHealthGrid";
import { SecuritySnapshot } from "@/components/super-admin/dashboard/SecuritySnapshot";
import { GovernancePanel } from "@/components/super-admin/dashboard/GovernancePanel";
import { AlertCenter } from "@/components/super-admin/dashboard/AlertCenter";
import { ActivityTimeline } from "@/components/super-admin/dashboard/ActivityTimeline";
import { Users, Activity, Target } from "lucide-react";

export const metadata = {
  title: "Sovereign Dashboard — QuizArena Command Center",
  description: "Executive strategic operational dashboard.",
};

export const dynamic = "force-dynamic";

export default async function SovereignDashboardPage() {
  const result = await validateSuperAdmin();

  if (!result.authorized || !result.context) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  const data = await getSovereignDashboardData();
  const { overview } = data;

  return (
    <div className="space-y-6 pb-12">
      <SovereignCommandHeader email={result.context.email} />

      {/* Primary Strategic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SovereignMetricCard
          label="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon={Users}
          trend={overview.engagementTrend}
          description="Total registered users across the platform."
        />
        <SovereignMetricCard
          label="Active Challenges"
          value={overview.activeChallenges.toLocaleString()}
          icon={Target}
          severity={overview.infrastructureState}
          description="Total published challenges available."
        />
        <SovereignMetricCard
          label="Health Score"
          value={`${overview.operationalHealthScore}/100`}
          icon={Activity}
          severity={
            overview.infrastructureState === "CRITICAL"
              ? "CRITICAL"
              : overview.operationalHealthScore > 95
                ? "HEALTHY"
                : "WARNING"
          }
          description="Synthesized platform operational health."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Systems & Governance */}
        <div className="xl:col-span-2 space-y-6">
          <InfrastructureHealthGrid data={data.health} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecuritySnapshot data={data.security} />
            <GovernancePanel data={data.governance} />
          </div>
        </div>

        {/* Right Column: Alerts & Timeline */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex-1 min-h-[300px]">
            <AlertCenter data={data.alerts} />
          </div>
          <div className="flex-1 min-h-[400px]">
            <ActivityTimeline events={data.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
