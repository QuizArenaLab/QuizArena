import Link from "next/link";
import { requireAdmin } from "@/features/rbac/services/guards";
import { getAdminDashboardData } from "@/features/super-admin/services/admin-dashboard";
import {
  Shield,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  ClipboardList,
  UserCog,
  XCircle,
  Eye,
  Zap,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdmin("/dashboard");

  let dashboardData;
  try {
    dashboardData = await getAdminDashboardData();
  } catch {
    dashboardData = null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1C40]">Operational Dashboard</h1>
            <p className="text-sm text-gray-500">Platform health and governance overview</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      {dashboardData && (
        <>
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-[#0A1C40]">Platform Health</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Active Challenges</p>
                <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                  {formatNumber(dashboardData.platformHealth.activeChallenges)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Scheduled</p>
                <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                  {formatNumber(dashboardData.platformHealth.scheduledChallenges)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Published</p>
                <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                  {formatNumber(dashboardData.platformHealth.publishedChallenges)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {formatNumber(dashboardData.platformHealth.pendingModeration)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Active Users</p>
                <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                  {formatNumber(dashboardData.platformHealth.totalActiveUsers)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Completed Today</p>
                <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                  {formatNumber(dashboardData.platformHealth.challengesCompletedToday)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Mod. Backlog</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatNumber(dashboardData.platformHealth.moderationBacklog)}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-[#0A1C40]">Moderation Queue</h2>
                </div>
                <Link
                  href="/dashboard/admin/moderation"
                  className="text-sm text-[#E6701E] hover:text-[#d25d15] font-medium"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-gray-500">Pending Reviews</span>
                  </div>
                  <p className="text-xl font-bold text-[#0A1C40]">
                    {dashboardData.moderationQueue.pendingReviews}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-gray-500">Rejected</span>
                  </div>
                  <p className="text-xl font-bold text-[#0A1C40]">
                    {dashboardData.moderationQueue.rejectedChallenges}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-gray-500">Flagged Questions</span>
                  </div>
                  <p className="text-xl font-bold text-[#0A1C40]">
                    {dashboardData.moderationQueue.flaggedQuestions}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Queue Total</span>
                  </div>
                  <p className="text-xl font-bold text-[#0A1C40]">
                    {dashboardData.moderationQueue.queueCount}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-[#0A1C40] mb-3">
                  Recent Review Activity
                </h3>
                <div className="space-y-3">
                  {dashboardData.moderationQueue.recentReviewActivity.length > 0 ? (
                    dashboardData.moderationQueue.recentReviewActivity.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.status === "PUBLISHED"
                                ? "bg-green-500"
                                : item.status === "REJECTED"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-[#0A1C40] truncate max-w-[200px]">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              by {item.reviewedBy || "Unknown"} • {formatTime(item.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.status === "PUBLISHED"
                              ? "bg-green-50 text-green-700"
                              : item.status === "REJECTED"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status.toLowerCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No recent review activity
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-[#0A1C40]">System Alerts</h2>
              </div>
              <div className="space-y-3">
                {dashboardData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border ${
                      alert.type === "critical"
                        ? "bg-red-50 border-red-100"
                        : alert.type === "warning"
                          ? "bg-amber-50 border-amber-100"
                          : "bg-green-50 border-green-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 ${
                          alert.type === "critical"
                            ? "text-red-600"
                            : alert.type === "warning"
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        {alert.type === "critical" ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : alert.type === "warning" ? (
                          <Zap className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0A1C40]">{alert.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        {alert.actionUrl && (
                          <Link
                            href={alert.actionUrl}
                            className="text-xs text-[#E6701E] hover:underline mt-2 inline-block"
                          >
                            Take action →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-[#0A1C40]">Moderator Activity</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Created Today</p>
                  <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                    {dashboardData.moderatorActivity.challengesCreatedToday}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Approvals (Week)</p>
                  <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                    {dashboardData.moderatorActivity.approvalsCompleted}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-[#0A1C40] mb-3">Reviewer Activity</h3>
                <div className="space-y-3">
                  {dashboardData.moderatorActivity.reviewerActivity.length > 0 ? (
                    dashboardData.moderatorActivity.reviewerActivity.map((mod) => (
                      <div
                        key={mod.moderatorId}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {mod.moderatorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0A1C40]">
                              {mod.moderatorName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {mod.lastActivity ? formatTime(mod.lastActivity) : "No activity"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#0A1C40]">
                          {mod.reviewsCompleted} reviews
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No moderator activity</p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-[#0A1C40]">User Activity</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Daily Active</p>
                  <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                    {dashboardData.userActivity.dailyActiveUsers}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Participation</p>
                  <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                    {dashboardData.userActivity.challengeParticipation}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-[#0A1C40] mt-1">
                    {dashboardData.userActivity.completionRate}%
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-xs text-gray-500">Drop-offs</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {dashboardData.userActivity.dropOffIndicators.startedNotCompleted}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-[#0A1C40]">Engagement Trends (7 Days)</h2>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="grid grid-cols-7 gap-4">
                {dashboardData.engagementTrends.map((day) => {
                  const maxAttempts = Math.max(
                    ...dashboardData.engagementTrends.map((d) => d.attempts),
                    1
                  );
                  const heightPercent = (day.attempts / maxAttempts) * 100;

                  return (
                    <div key={day.date} className="text-center">
                      <div className="h-32 flex flex-col items-end justify-end mb-2">
                        <div
                          className="w-full bg-[#E6701E] rounded-t-md transition-all duration-300"
                          style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{day.attempts}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-[#0A1C40]">Recent Activity</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="space-y-3">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1C40]">{activity.message}</p>
                          <p className="text-xs text-gray-400">
                            by {activity.user || "System"} • {formatTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {!dashboardData && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0A1C40] mb-2">Dashboard Loading</h3>
          <p className="text-gray-500">Retrieving operational metrics...</p>
        </div>
      )}
    </div>
  );
}
