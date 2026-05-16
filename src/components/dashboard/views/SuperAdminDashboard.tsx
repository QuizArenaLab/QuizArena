import { 
  Shield, 
  DollarSign, 
  Settings2, 
  Users, 
  Key, 
  Activity, 
  Server,
  AlertTriangle 
} from "lucide-react";

export async function SuperAdminDashboardView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-purple-50 rounded-lg">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Full platform authority and controls</p>
        </div>
      </div>

      {/* Security Alert */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800">Restricted Access</p>
          <p className="text-sm text-red-600">This dashboard provides system-level access. All actions are logged.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">$0</p>
          <p className="text-sm text-gray-500">Revenue (MTD)</p>
        </div>

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
            <div className="p-2 bg-purple-50 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">0</p>
          <p className="text-sm text-gray-500">Active Sessions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Server className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-navy">Healthy</p>
          <p className="text-sm text-gray-500">System Status</p>
        </div>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/dashboard/financials"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Revenue & Payouts</p>
            <p className="text-sm text-gray-500">Financial analytics and payments</p>
          </div>
        </a>

        <a
          href="/dashboard/platform"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-blue-50 rounded-lg">
            <Settings2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Platform Settings</p>
            <p className="text-sm text-gray-500">System configuration</p>
          </div>
        </a>

        <a
          href="/dashboard/roles"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-purple-50 rounded-lg">
            <Key className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Role Management</p>
            <p className="text-sm text-gray-500">Assign and manage roles</p>
          </div>
        </a>

        <a
          href="/dashboard/users"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-amber-50 rounded-lg">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">User Administration</p>
            <p className="text-sm text-gray-500">Full user control</p>
          </div>
        </a>

        <a
          href="/dashboard/system"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-gray-100 rounded-lg">
            <Server className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Infrastructure</p>
            <p className="text-sm text-gray-500">System health and logs</p>
          </div>
        </a>

        <a
          href="/dashboard/audit"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-3 bg-red-50 rounded-lg">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Audit Logs</p>
            <p className="text-sm text-gray-500">Track all admin actions</p>
          </div>
        </a>
      </div>

      {/* Revenue Section Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-navy">Revenue Analytics</h2>
        </div>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400">Revenue charts will appear here</p>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-navy">System Health</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-600 font-semibold">Database</p>
            <p className="text-sm text-green-600">Connected</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-600 font-semibold">Auth Service</p>
            <p className="text-sm text-green-600">Operational</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-600 font-semibold">API</p>
            <p className="text-sm text-green-600">Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
