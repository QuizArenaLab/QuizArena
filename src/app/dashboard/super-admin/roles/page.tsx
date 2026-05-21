import { requireSuperAdmin } from "@/lib/rbac/super-admin";
import { ROUTES } from "@/lib/routes";
import {
  getRoleOverviewStats,
  getPromotableUsers,
  getRoleChangeHistory,
} from "@/actions/super-admin/role-governance";
import {
  Crown,
  Shield,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { RoleChangeActions } from "./RoleChangeActions";

export default async function SuperAdminRolesPage() {
  await requireSuperAdmin(ROUTES.PROTECTED.DASHBOARD);

  const [stats, users, history] = await Promise.all([
    getRoleOverviewStats(),
    getPromotableUsers(),
    getRoleChangeHistory(20),
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-purple-50 text-purple-700 font-bold">
            Super Admin
          </span>
        );
      case "ADMIN":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700 font-medium">
            Admin
          </span>
        );
      case "MODERATOR":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
            Moderator
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
            User
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-lg">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">Role Governance</h1>
            <p className="text-sm text-gray-500">Authority hierarchy and privilege management</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
          <Crown className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Super Admin Access</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <p className="text-2xl font-bold text-[#0A1C40]">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-500">Moderators</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalModerators}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-400" />
            <p className="text-xs text-gray-500">Admins</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.totalAdmins}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500">Super Admins</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalSuperAdmins}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Changes (7d)</p>
          </div>
          <p className="text-2xl font-bold text-[#0A1C40]">{stats.recentRoleChanges}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#0A1C40] flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-green-500" />
              Promote Users
            </h2>
          </div>
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {users.users.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Users → Moderator
                </h3>
                <div className="space-y-2">
                  {users.users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">
                            {user.name || user.username || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                        </div>
                      </div>
                      <RoleChangeActions user={user} action="promoteToModerator" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {users.moderators.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Moderators → Admin
                </h3>
                <div className="space-y-2">
                  {users.moderators.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">
                            {user.name || user.username || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                        </div>
                      </div>
                      <RoleChangeActions user={user} action="promoteToAdmin" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {users.admins.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Admins → Super Admin
                </h3>
                <div className="space-y-2">
                  {users.admins.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-red-600">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">
                            {user.name || user.username || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                        </div>
                      </div>
                      <RoleChangeActions user={user} action="assignSuperAdmin" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {users.users.length === 0 &&
              users.moderators.length === 0 &&
              users.admins.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  No users available for promotion
                </p>
              )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#0A1C40] flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
              Role Change History
            </h2>
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {history.length > 0 ? (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {entry.targetUser.name?.charAt(0).toUpperCase() ||
                          entry.targetUser.username?.charAt(0).toUpperCase() ||
                          "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0A1C40]">
                        {entry.targetUser.name || entry.targetUser.username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getRoleBadge(entry.previousRole)} → {getRoleBadge(entry.newRole)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatTimeAgo(entry.changedAt)}</p>
                    <p className="text-xs text-gray-400">by {entry.changedBy.name || "Unknown"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No role changes recorded</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#0A1C40]">Current Privilege Holders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...users.admins, ...users.moderators].map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user.role === "ADMIN" ? "bg-red-100" : "bg-blue-100"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium ${
                            user.role === "ADMIN" ? "text-red-600" : "text-blue-600"
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0A1C40]">
                          {user.name || user.username || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RoleChangeActions
                      user={user}
                      action={user.role === "ADMIN" ? "revokeSuperAdmin" : "demoteToUser"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
