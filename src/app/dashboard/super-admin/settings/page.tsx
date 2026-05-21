/**
 * QuizArena — Super Admin Platform Settings Page
 *
 * Extended governance dashboard with full platform control.
 * Includes System category and infrastructure-sensitive settings.
 *
 * SUPER_ADMIN ONLY access.
 */

import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { validateSuperAdminAccess } from "@/lib/rbac/super-admin";
import { getSettingsDashboardData, getUnseededSettingsCount } from "@/actions/settings";
import { SettingsPanel } from "@/components/dashboard/settings/SettingsPanel";
import { Settings2, ShieldAlert } from "lucide-react";

export default async function SuperAdminSettingsPage() {
  const validation = await validateSuperAdminAccess();

  if (!validation.authorized) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  let dashboardData;
  let unseededCount = 0;

  try {
    [dashboardData, unseededCount] = await Promise.all([
      getSettingsDashboardData(),
      getUnseededSettingsCount(),
    ]);
  } catch {
    dashboardData = null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-xl">
            <Settings2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">Platform Configuration</h1>
            <p className="text-sm text-gray-500">
              Full platform control including system and infrastructure settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-100">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-red-700">Super Admin</span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Elevated Access Active</p>
          <p className="text-xs text-red-600 mt-0.5">
            You have access to infrastructure-sensitive system controls. All changes are
            audit-logged. Protected settings (maintenance mode, debug mode) are only modifiable at
            this access level.
          </p>
        </div>
      </div>

      {/* Content */}
      {dashboardData ? (
        <SettingsPanel
          settings={dashboardData.settings}
          recentAudits={dashboardData.recentAudits}
          isSuperAdmin={true}
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
