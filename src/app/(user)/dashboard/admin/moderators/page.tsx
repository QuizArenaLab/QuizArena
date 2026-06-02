import Link from "next/link";
import { requireAdmin } from "@/features/rbac/services/guards";
import { getModerators, getModeratorStats } from "@/features/super-admin/services/moderator-management";
import { Users, Search, ChevronLeft, ChevronRight, Shield } from "lucide-react";

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  activity?: string;
  performance?: string;
}

export default async function AdminModeratorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin("/dashboard");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const status = params.status || "all";
  const activity = params.activity || "all";
  const performance = params.performance || "all";

  const [moderatorsData, stats] = await Promise.all([
    getModerators({
      page,
      limit: 20,
      search: search || undefined,
      status,
      activityState: activity !== "all" ? activity : undefined,
      performance: performance !== "all" ? performance : undefined,
    }),
    getModeratorStats(),
  ]);

  const buildQuery = (updates: Partial<Record<string, string>>) => {
    const current = { page: "1", search, status, activity, performance, ...updates };
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
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return formatDate(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">Active</span>
        );
      case "SUSPENDED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">Suspended</span>
        );
      case "RESTRICTED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
            Restricted
          </span>
        );
      case "INACTIVE":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">Inactive</span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">{status}</span>
        );
    }
  };

  const getApprovalColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">Moderator Management</h1>
            <p className="text-sm text-gray-500">Workforce governance and operational oversight</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Moderators</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.totalModerators}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeModerators}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Suspended</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.suspendedModerators}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Restricted</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.restrictedModerators}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Avg Approval Rate</p>
          <p className={`text-2xl font-bold mt-1 ${getApprovalColor(stats.averageApprovalRate)}`}>
            {stats.averageApprovalRate}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Challenges Created</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.totalChallengesCreated}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500">Reviews Done</p>
          <p className="text-2xl font-bold text-[#0A1C40] mt-1">{stats.totalReviewsCompleted}</p>
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
              name="status"
              defaultValue={status}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="RESTRICTED">Restricted</option>
              <option value="INACTIVE">Inactive</option>
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
              name="performance"
              defaultValue={performance}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
            >
              <option value="all">Performance</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (50-79%)</option>
              <option value="low">Low (&lt;50%)</option>
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
                  Moderator
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Challenges
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Approval Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {moderatorsData.moderators.length > 0 ? (
                moderatorsData.moderators.map((mod) => (
                  <tr key={mod.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-600">
                            {mod.name?.charAt(0).toUpperCase() ||
                              mod.username?.charAt(0).toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">
                            {mod.name || mod.username || "No name"}
                          </p>
                          <p className="text-xs text-gray-400">{mod.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          mod.role === "ADMIN"
                            ? "bg-red-50 text-red-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {mod.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(mod.moderatorStatus)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#0A1C40]">{mod.challengesCreated}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#0A1C40]">{mod.reviewsCompleted}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-semibold ${getApprovalColor(mod.approvalRate)}`}
                      >
                        {mod.approvalRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(mod.lastActiveAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/admin/moderators/${mod.id}`}
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
                      <p className="text-sm text-gray-500">No moderators found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {moderatorsData.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(moderatorsData.page - 1) * moderatorsData.limit + 1} to{" "}
              {Math.min(moderatorsData.page * moderatorsData.limit, moderatorsData.total)} of{" "}
              {moderatorsData.total} moderators
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`?${buildQuery({ page: String(moderatorsData.page - 1) })}`}
                className={`p-2 rounded-lg border border-gray-200 ${
                  moderatorsData.page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </Link>
              <span className="text-sm text-gray-600">
                Page {moderatorsData.page} of {moderatorsData.totalPages}
              </span>
              <Link
                href={`?${buildQuery({ page: String(moderatorsData.page + 1) })}`}
                className={`p-2 rounded-lg border border-gray-200 ${
                  moderatorsData.page >= moderatorsData.totalPages
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
