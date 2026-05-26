import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/rbac/guards";
import { getModeratorProfile, addModeratorNote } from "@/actions/manage/moderator-management";
import { ArrowLeft, Calendar, PlayCircle, MessageSquare, TrendingUp, Users } from "lucide-react";
import { ModeratorProfileActions } from "./ModeratorProfileActions";

export default async function AdminModeratorProfilePage({
  params,
}: {
  params: Promise<{ moderatorId: string }>;
}) {
  await requireAdmin("/dashboard");

  const { moderatorId } = await params;
  const moderator = await getModeratorProfile(moderatorId);

  if (!moderator) {
    redirect("/dashboard/admin/moderators");
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 font-medium">
            Active
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-red-50 text-red-700 font-medium">
            Suspended
          </span>
        );
      case "RESTRICTED":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700 font-medium">
            Restricted
          </span>
        );
      case "INACTIVE":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-50 text-gray-600 font-medium">
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-50 text-gray-600 font-medium">
            {status}
          </span>
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
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/moderators"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1C40]">Moderator Profile</h1>
          <p className="text-sm text-gray-500">Operational inspection and governance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {moderator.name?.charAt(0).toUpperCase() ||
                      moderator.username?.charAt(0).toUpperCase() ||
                      "?"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1C40]">
                    {moderator.name || "No name"}
                  </h2>
                  <p className="text-gray-500">@{moderator.username || "No username"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        moderator.role === "ADMIN"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {moderator.role}
                    </span>
                    {getStatusBadge(moderator.moderatorStatus)}
                  </div>
                </div>
              </div>
              <ModeratorProfileActions moderator={moderator} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#0A1C40]">
                  {moderator.performance.totalChallengesCreated}
                </p>
                <p className="text-xs text-gray-500">Challenges Created</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#0A1C40]">
                  {moderator.performance.totalReviewsCompleted}
                </p>
                <p className="text-xs text-gray-500">Reviews Done</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p
                  className={`text-2xl font-bold ${getApprovalColor(moderator.performance.approvalRate)}`}
                >
                  {moderator.performance.approvalRate}%
                </p>
                <p className="text-xs text-gray-500">Approval Rate</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {moderator.performance.approvedCount}
                </p>
                <p className="text-xs text-gray-500">Approved</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {moderator.performance.rejectedCount}
                </p>
                <p className="text-xs text-gray-500">Rejected</p>
              </div>
            </div>

            {moderator.performance.recentActivity.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Recent Activity (7 days)
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dateStr = date.toISOString().split("T")[0];
                    const dayData = moderator.performance.recentActivity.find(
                      (d) => d.date === dateStr
                    );
                    const maxReviews = Math.max(
                      ...moderator.performance.recentActivity.map((d) => d.reviews),
                      1
                    );
                    const heightPercent = dayData ? (dayData.reviews / maxReviews) * 100 : 0;

                    return (
                      <div key={i} className="text-center">
                        <div className="h-20 flex flex-col items-end justify-end mb-2">
                          <div
                            className="w-full bg-purple-500 rounded-t-md transition-all duration-300"
                            style={{ height: `${Math.max(heightPercent, 4)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-gray-400" />
              Challenge Contributions
            </h3>
            {moderator.challenges.length > 0 ? (
              <div className="space-y-3">
                {moderator.challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0A1C40]">{challenge.title}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(challenge.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          challenge.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700"
                            : challenge.status === "REVIEW"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {challenge.status.toLowerCase()}
                      </span>
                      {challenge.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Published: {formatDate(challenge.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PlayCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No challenges created yet</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Review History
            </h3>
            {moderator.reviewHistory.length > 0 ? (
              <div className="space-y-3">
                {moderator.reviewHistory.slice(0, 10).map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0A1C40]">{review.title}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(review.updatedAt)}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        review.action === "approved"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {review.action}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No reviews completed yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              Operational Notes
            </h3>
            <form
              action={async (formData) => {
                "use server";
                const note = formData.get("note") as string;
                if (note?.trim()) {
                  await addModeratorNote(moderatorId, note);
                }
              }}
              className="mb-4"
            >
              <textarea
                name="note"
                placeholder="Add an operational note..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E] resize-none"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-[#E6701E] text-white text-sm font-medium rounded-lg hover:bg-[#d25d15] transition-colors w-full"
              >
                Add Note
              </button>
            </form>

            {moderator.operationalNotes.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {moderator.operationalNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[#0A1C40]">{note.note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {note.createdBy.name || "Admin"} • {formatTimeAgo(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No operational notes</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Account Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Joined</span>
                <span className="text-sm font-medium text-[#0A1C40]">
                  {formatDate(moderator.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Active</span>
                <span className="text-sm font-medium text-[#0A1C40]">
                  {formatTimeAgo(moderator.lastActiveAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Publishing Freq</span>
                <span className="text-sm font-medium text-[#0A1C40]">
                  {moderator.performance.publishingFrequency}/month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
