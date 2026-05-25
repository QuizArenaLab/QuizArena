import { requireSuperAdmin } from "@/lib/super-admin/governance";
import { getPlatformState } from "@/lib/super-admin/infrastructure/platform-controls";
import { getInfrastructureHealth } from "@/lib/super-admin/infrastructure/health";
import { PlatformHealthCenter } from "./components/PlatformHealthCenter";
import { MaintenanceControl } from "./components/MaintenanceControl";
import { FeatureGovernance } from "./components/FeatureGovernance";
import { ServerCrash, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Infrastructure & Platform Control | QuizArena",
};

export const dynamic = "force-dynamic";

export default async function InfrastructurePage() {
  await requireSuperAdmin();

  const [platformState, health] = await Promise.all([
    getPlatformState(),
    getInfrastructureHealth(),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1C40] flex items-center gap-2">
            <ServerCrash className="w-6 h-6 text-indigo-600" />
            Infrastructure & Platform Control
          </h1>
          <p className="text-gray-500 mt-1">
            Sovereign governance over platform health, maintenance, and critical features.
          </p>
        </div>
      </div>

      {health.status === "CRITICAL" && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Critical Infrastructure Alert</h3>
            <p className="text-sm mt-1">
              One or more core infrastructure components (e.g., Database) are currently offline or
              unreachable. Platform stability is severely impacted.
            </p>
          </div>
        </div>
      )}

      {/* Health Overview */}
      <PlatformHealthCenter health={health} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Feature Governance */}
          <FeatureGovernance features={platformState} />
        </div>

        <div className="space-y-6">
          {/* Maintenance Mode */}
          <MaintenanceControl
            isEnabled={platformState.maintenanceMode.enabled}
            currentMessage={platformState.maintenanceMode.message}
          />

          {/* Audit Logging Notice */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Strict Governance Enforced</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All infrastructure changes made on this screen bypass standard workflows and are
              executed with <strong>SUPER_ADMIN</strong> authority. Every action generates a
              high-priority, immutable infrastructure audit log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
