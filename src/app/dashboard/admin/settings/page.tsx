/**
 * QuizArena — Admin Platform Settings Page
 *
 * Governance dashboard for operational platform configuration.
 * Accessible by ADMIN and SUPER_ADMIN roles.
 *
 * ADMIN can manage: General, Challenges, Moderation, Auth, Analytics
 * SUPER_ADMIN can additionally manage: System (infrastructure)
 */

import { requireAdmin, getCurrentRoleFromSession } from "@/lib/rbac/guards";
import { getSettingsDashboardData, getUnseededSettingsCount } from "@/actions/settings";
import { SettingsPanel } from "@/components/dashboard/settings/SettingsPanel";
import { hasRole } from "@/lib/rbac/hierarchy";
import { ROLES } from "@/lib/rbac/roles";
import { Settings2, Shield } from "lucide-react";

export default async function AdminSettingsPage() {
  await requireAdmin("/dashboard");

  const role = await getCurrentRoleFromSession();
  const isSuperAdmin = hasRole(role, ROLES.SUPER_ADMIN);

  let dashboardData;
  let unseededCount = 0;

  try {
    [dashboardData, unseededCount] = await Promise.all([
      getSettingsDashboardData(),
      isSuperAdmin ? getUnseededSettingsCount() : Promise.resolve(0),
    ]);
  } catch {
    dashboardData = null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#E6701E]/10 rounded-xl">
            <Settings2 className="w-6 h-6 text-[#E6701E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">Platform Settings</h1>
            <p className="text-sm text-gray-500">
              Manage operational configuration and feature controls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">
            {isSuperAdmin ? "Full Access" : "Operational Access"}
          </span>
        </div>
      </div>

      {/* Content */}
      {dashboardData ? (
        <SettingsPanel
          settings={dashboardData.settings}
          recentAudits={dashboardData.recentAudits}
          isSuperAdmin={isSuperAdmin}
          totalSettings={dashboardData.totalSettings}
          unseededCount={unseededCount}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0A1C40] mb-2">Settings Unavailable</h3>
          <p className="text-gray-500 text-sm">
            Unable to load platform settings. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
