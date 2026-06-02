import { Metadata } from "next";
import { LifeBuoy } from "lucide-react";
import { EmergencyControlCenter } from "@/features/super-admin/components/disaster-recovery/EmergencyControlCenter";
import { RecoveryReadinessDashboard } from "@/features/super-admin/components/disaster-recovery/RecoveryReadinessDashboard";
import { ResilienceMonitoring } from "@/features/super-admin/components/disaster-recovery/ResilienceMonitoring";
import { RecoveryWorkflows } from "@/features/super-admin/components/disaster-recovery/RecoveryWorkflows";
import {
  getResilienceOverview,
  getRecoveryWorkflows,
  getBackupSnapshots,
  activateRecoveryMode,
  activateEmergencyLockdown,
  deactivateEmergencyLockdown,
} from "@/features/super-admin/services/disaster-recovery";
import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Disaster Recovery | Sovereign Control | QuizArena",
  description: "Enterprise disaster recovery and fail-safe controls",
};

export default async function DisasterRecoveryPage() {
  // DB-authoritative check (fail-closed)
  await requireSuperAdmin();

  // Load sovereign state
  const overview = await getResilienceOverview();
  const workflows = await getRecoveryWorkflows();
  const snapshots = await getBackupSnapshots();

  // Server Actions for Fail-Safe controls
  const handleActivateRecovery = async (reason: string) => {
    "use server";
    const authSession = await requireSuperAdmin();
    await activateRecoveryMode(authSession.userId, authSession.email, reason);
    revalidatePath("/dashboard/super-admin/disaster-recovery");
  };

  const handleActivateLockdown = async (reason: string) => {
    "use server";
    const authSession = await requireSuperAdmin();
    await activateEmergencyLockdown(authSession.userId, authSession.email, reason);
    revalidatePath("/dashboard/super-admin/disaster-recovery");
  };

  const handleDeactivateLockdown = async (reason: string) => {
    "use server";
    const authSession = await requireSuperAdmin();
    await deactivateEmergencyLockdown(authSession.userId, authSession.email, reason);
    revalidatePath("/dashboard/super-admin/disaster-recovery");
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center justify-center shadow-lg shadow-red-900/20">
              <LifeBuoy className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight font-hanken">
              Disaster Recovery
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Sovereign fail-safe systems and operational survivability infrastructure. All actions
            here are server-authoritative and immediately affect global platform state.
          </p>
        </div>
      </div>

      {/* Main Governance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Primary Controls & Visibility) */}
        <div className="xl:col-span-2 space-y-6">
          <EmergencyControlCenter
            currentState={overview.currentState}
            onActivateRecovery={handleActivateRecovery}
            onActivateLockdown={handleActivateLockdown}
            onDeactivateLockdown={handleDeactivateLockdown}
          />

          <RecoveryReadinessDashboard overview={overview} snapshots={snapshots} />

          <RecoveryWorkflows workflows={workflows} />
        </div>

        {/* Right Column (Monitoring) */}
        <div className="space-y-6">
          <ResilienceMonitoring services={overview.services} />
        </div>
      </div>
    </div>
  );
}
