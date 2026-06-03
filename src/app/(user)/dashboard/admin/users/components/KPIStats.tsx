import React from "react";
import { Users, UserCheck, ShieldOff, AlertTriangle, UserPlus, Crown } from "lucide-react";

interface KPIStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    suspendedUsers: number;
    newToday: number;
    flaggedAccounts: number;
  };
  lifecycle: {
    newUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
  };
}

export function KPIStats({ stats, lifecycle }: KPIStatsProps) {
  const totalLifecycle =
    lifecycle.newUsers + lifecycle.activeUsers + lifecycle.inactiveUsers + lifecycle.suspendedUsers;

  const getPercentage = (value: number) => {
    if (totalLifecycle === 0) return 0;
    return Math.round((value / totalLifecycle) * 100);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.totalUsers}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-green-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Premium Users</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.premiumUsers}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
            <Crown className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Suspended Users</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.suspendedUsers}</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-red-500">
            <ShieldOff className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">New Today</p>
            <p className="text-2xl font-bold text-[#E6701E] mt-1">{stats.newToday}</p>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg text-[#E6701E]">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Flagged Accounts</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.flaggedAccounts}</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* User Lifecycle Distribution */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#0A1C40] mb-4">User Lifecycle Distribution</h3>
        <div className="flex items-center gap-2 mb-2 h-4 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${getPercentage(lifecycle.newUsers)}%` }}
            title={`New Users (${lifecycle.newUsers})`}
          />
          <div
            className="bg-green-500 h-full"
            style={{ width: `${getPercentage(lifecycle.activeUsers)}%` }}
            title={`Active Users (${lifecycle.activeUsers})`}
          />
          <div
            className="bg-gray-300 h-full"
            style={{ width: `${getPercentage(lifecycle.inactiveUsers)}%` }}
            title={`Inactive Users (${lifecycle.inactiveUsers})`}
          />
          <div
            className="bg-red-500 h-full"
            style={{ width: `${getPercentage(lifecycle.suspendedUsers)}%` }}
            title={`Suspended Users (${lifecycle.suspendedUsers})`}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>New (30d): {lifecycle.newUsers}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Active (7d): {lifecycle.activeUsers}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span>Inactive: {lifecycle.inactiveUsers}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Suspended: {lifecycle.suspendedUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
