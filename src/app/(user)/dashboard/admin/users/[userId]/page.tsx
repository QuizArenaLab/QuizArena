import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from '@/features/rbac/components/RoleGuard';
import { getUserProfile, addModerationNote } from '@/features/super-admin/services/user-management';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  Activity,
  PlayCircle,
  MessageSquare,
} from "lucide-react";
import { UserProfileActions } from "./UserProfileActions";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin("/dashboard");

  const { userId } = await params;
  const user = await getUserProfile(userId);

  if (!user) {
    redirect("/dashboard/admin/users");
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

  const getAccountStateBadge = (state: string) => {
    switch (state) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 font-medium">
            Active
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700 font-medium">
            Suspended
          </span>
        );
      case "BANNED":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-red-50 text-red-700 font-medium">
            Banned
          </span>
        );
      case "DEACTIVATED":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-50 text-gray-600 font-medium">
            Deactivated
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-50 text-gray-600 font-medium">
            {state}
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-purple-50 text-purple-700 font-medium">
            Super Admin
          </span>
        );
      case "ADMIN":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-red-50 text-red-700 font-medium">
            Admin
          </span>
        );
      case "MODERATOR":
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 font-medium">
            Moderator
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
            User
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/users"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1C40]">User Profile</h1>
          <p className="text-sm text-gray-500">Operational inspection and governance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.username?.charAt(0).toUpperCase() ||
                      "?"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1C40]">{user.name || "No name"}</h2>
                  <p className="text-gray-500">@{user.username || "No username"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(user.role)}
                    {getAccountStateBadge(user.accountState)}
                  </div>
                </div>
              </div>
              <UserProfileActions user={user} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-[#0A1C40]">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-[#0A1C40]">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Active</p>
                  <p className="text-sm font-medium text-[#0A1C40]">
                    {formatTimeAgo(user.lastActiveAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Onboarding</p>
                  <p className="text-sm font-medium text-[#0A1C40]">
                    {user.onboardingCompleted ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
              {(user as any).category && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Exam Category</p>
                    <p className="text-sm font-medium text-[#0A1C40]">{(user as any).category}</p>
                  </div>
                </div>
              )}
              {user.preparationLevel && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Preparation Level</p>
                    <p className="text-sm font-medium text-[#0A1C40]">{user.preparationLevel}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-gray-400" />
              Challenge Activity
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#0A1C40]">
                  {user.attemptStats.totalAttempts}
                </p>
                <p className="text-xs text-gray-500">Total Attempts</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {user.attemptStats.completedAttempts}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#0A1C40]">
                  {user.attemptStats.averageScore}%
                </p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[#E6701E]">{user.attemptStats.bestScore}</p>
                <p className="text-xs text-gray-500">Best Score</p>
              </div>
            </div>

            {user.attempts.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Attempts
                </h4>
                {user.attempts.slice(0, 10).map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0A1C40]">
                        {attempt.challenge.title}
                      </p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(attempt.startedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0A1C40]">{attempt.score} pts</p>
                      <p className="text-xs text-gray-400">
                        {attempt.correctAnswers}✓ / {attempt.wrongAnswers}✗
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PlayCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No challenge attempts yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              Moderation Notes
            </h3>
            <form
              action={async (formData) => {
                "use server";
                const note = formData.get("note") as string;
                if (note?.trim()) {
                  await addModerationNote(userId, note);
                }
              }}
              className="mb-4"
            >
              <textarea
                name="note"
                placeholder="Add a moderation note..."
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

            {user.moderationNotes.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {user.moderationNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[#0A1C40]">{note.note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {note.createdBy.name || "Admin"} • {formatTimeAgo(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No moderation notes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
