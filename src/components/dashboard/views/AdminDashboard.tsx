import { Users, ClipboardList, BarChart3, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export async function AdminDashboardView() {
  // We don't need requireMinimumRole here as it's checked by the dispatcher

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-red-50 rounded-lg">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Platform operations and user management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">0</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">0</p>
          <p className="text-sm text-gray-500">Pending Reports</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">0</p>
          <p className="text-sm text-gray-500">Resolved Today</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">0</p>
          <p className="text-sm text-gray-500">Critical Alerts</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/dashboard/users"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <Users className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-semibold text-navy">Manage Users</p>
            <p className="text-xs text-gray-500">View and moderate users</p>
          </div>
        </a>

        <a
          href="/dashboard/moderators"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-semibold text-navy">Moderator Oversight</p>
            <p className="text-xs text-gray-500">Manage moderator permissions</p>
          </div>
        </a>

        <a
          href="/dashboard/reports"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <ClipboardList className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-semibold text-navy">Review Reports</p>
            <p className="text-xs text-gray-500">Process user reports</p>
          </div>
        </a>
      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-navy">Platform Overview</h2>
        </div>
        <div className="h-48 flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400">Operational analytics will appear here</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">No moderation reports</h3>
        <p className="text-gray-500">User reports will appear here for review</p>
      </div>
    </div>
  );
}
