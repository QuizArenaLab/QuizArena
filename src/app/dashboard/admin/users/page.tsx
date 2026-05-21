import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/rbac/guards";
import { getUsers, getModerationStats } from "@/actions/manage/user-management";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  Ban,
  CheckCircle,
  XCircle,
  Flag,
  UserCog,
} from "lucide-react";

interface SearchParams {
  page?: string;
  search?: string;
  role?: string;
  onboarding?: string;
  activity?: string;
  accountState?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin("/dashboard");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const role = params.role || "all";
  const onboarding = params.onboarding || "all";
  const activity = params.activity || "all";
  const accountState = params.accountState || "all";

  const [usersData, stats] = await Promise.all([
    getUsers({
      page,
      limit: 20,
      search: search || undefined,
      role: role !== "all" ? role : undefined,
      onboardingStatus: onboarding !== "all" ? (onboarding as "completed" | "pending") : undefined,
      activityState: activity !== "all" ? (activity as "active" | "inactive") : undefined,
      accountState:
        accountState !== "all"
          ? (accountState as "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED")
          : undefined,
    }),
    getModerationStats(),
  ]);

  const buildQuery = (updates: Partial<Record<string, string>>) => {
    const current = {
      page: "1",
      search,
      role,
      onboarding,
      activity,
      accountState,
      ...updates,
    };
    const filtered = Object.entries(current).filter(([, v]) => v && v !== "all" && v !== "");
    return filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(date);
  };

  const getAccountStateBadge = (state: string) => {
    switch (state) {
      case "ACTIVE":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">Active</span>
        );
      case "SUSPENDED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
            Suspended
          </span>
        );
      case "BANNED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">Banned</span>
        );
      case "DEACTIVATED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">
            Deactivated
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">{state}</span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">User Management</h1>
            <p className="text-sm text-gray-500">Platform governance and user operations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Suspended</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.suspendedUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Banned</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.bannedUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Flagged</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.flaggedUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Suspensions (7d)</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.recentSuspensions}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Bans (7d)</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.recentBans}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <form className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name, username, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
              />
            </div>
            <select
              name="role"
              defaultValue={role}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">All Roles</option>
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <select
              name="onboarding"
              defaultValue={onboarding}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">Onboarding</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select
              name="activity"
              defaultValue={activity}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">Activity</option>
              <option value="active">Active (7d)</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              name="accountState"
              defaultValue={accountState}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">Account State</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E6701E] text-white text-sm font-medium rounded-lg hover:bg-[#d25d15] transition-colors"
            >
              Filter
            </button>
          </form>
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
                  Onboarding
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Attempts
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Active
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
              {usersData.users.length > 0 ? (
                usersData.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name?.charAt(0).toUpperCase() ||
                              user.username?.charAt(0).toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">
                            {user.name || user.username || "No name"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          user.role === "SUPER_ADMIN"
                            ? "bg-purple-50 text-purple-700"
                            : user.role === "ADMIN"
                              ? "bg-red-50 text-red-700"
                              : user.role === "MODERATOR"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.onboardingCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">{getAccountStateBadge(user.accountState)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#0A1C40]">
                        {user.completedChallenges}/{user.totalAttempts}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(user.lastActiveAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/admin/users/${user.id}`}
                        className="text-sm text-[#E6701E] hover:text-[#d25d15] font-medium"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {usersData.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(usersData.page - 1) * usersData.limit + 1} to{" "}
              {Math.min(usersData.page * usersData.limit, usersData.total)} of {usersData.total}{" "}
              users
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`?${buildQuery({ page: String(usersData.page - 1) })}`}
                className={`p-2 rounded-lg border border-gray-200 ${
                  usersData.page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </Link>
              <span className="text-sm text-gray-600">
                Page {usersData.page} of {usersData.totalPages}
              </span>
              <Link
                href={`?${buildQuery({ page: String(usersData.page + 1) })}`}
                className={`p-2 rounded-lg border border-gray-200 ${
                  usersData.page >= usersData.totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
