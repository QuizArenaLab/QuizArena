import { redirect } from "next/navigation";
import { validateSuperAdminSession } from "@/features/super-admin/services/session";
import { getFeatureRolloutsData } from "@/features/super-admin/services/feature-rollouts";
import { Rocket } from "lucide-react";

import { RolloutOverviewCards } from "@/features/super-admin/components/feature-rollouts/RolloutOverviewCards";
import { ActiveRolloutsTable } from "@/features/super-admin/components/feature-rollouts/ActiveRolloutsTable";
import { FeatureAnalyticsPanel } from "@/features/super-admin/components/feature-rollouts/FeatureAnalyticsPanel";

export const metadata = {
  title: "Feature Rollouts | Super Admin",
};

export default async function FeatureRolloutsPage() {
  const session = await validateSuperAdminSession();
  if (!session) redirect("/login");

  const data = await getFeatureRolloutsData();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Sovereign Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-900/40">
              <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">
              Global Feature Rollouts
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            Sovereign release-governance infrastructure. Control platform-wide feature distribution,
            execute staged percentage deployments, and govern operational experimentation safely.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400">
            Last Sync:{" "}
            <span className="text-slate-200 font-mono ml-1">
              {new Date(data.lastAggregatedISO).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <RolloutOverviewCards stats={data.stats} />

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveRolloutsTable flags={data.flags} />
        </div>
        <div className="lg:col-span-1">
          <FeatureAnalyticsPanel />
        </div>
      </div>
    </div>
  );
}
