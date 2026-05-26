import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getChallengeLeaderboardBySlug } from "@/actions/leaderboard";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  ChevronLeft,
  Clock,
  Target,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengeLeaderboardDetailPage({
  params,
}: LeaderboardDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const { slug } = await params;
  const data = await getChallengeLeaderboardBySlug(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Leaderboard Not Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any active or ended leaderboard for this challenge.
          </p>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Leaderboards
          </Link>
        </div>
      </div>
    );
  }

  const podium = [
    data.entries[1], // 2nd place (left)
    data.entries[0], // 1st place (center)
    data.entries[2], // 3rd place (right)
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  };

  const getPodiumBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-amber-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    return "bg-amber-700 text-white";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      {/* Back Button and Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors self-start"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Leaderboards
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">{data.challengeTitle}</h1>
          <p className="text-gray-500 flex flex-wrap items-center gap-4 text-sm mt-1">
            <span>
              🏆 {data.totalParticipants} Participant{data.totalParticipants !== 1 ? "s" : ""}
            </span>
            {data.isFrozen && (
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                Leaderboard Frozen
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ─── Podium (Top 3) ─── */}
      {data.entries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-8 pt-8 pb-4">
            {podium.map((entry) => {
              if (!entry) return null;

              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;

              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex flex-col items-center w-full max-w-[200px] border rounded-2xl p-5 shadow-sm transition-all",
                    isFirst
                      ? "order-1 sm:order-2 border-amber-200 bg-linear-to-b from-amber-50/50 to-white sm:-translate-y-4 scale-105"
                      : isSecond
                        ? "order-2 sm:order-1 border-gray-200 bg-linear-to-b from-gray-50/50 to-white"
                        : "order-3 border-orange-200 bg-linear-to-b from-orange-50/50 to-white",
                    entry.userId === session.user?.id && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className="relative mb-3">
                    {isFirst && (
                      <Crown className="w-8 h-8 text-amber-500 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-md animate-bounce" />
                    )}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 bg-gray-50",
                        isFirst
                          ? "border-amber-300"
                          : isSecond
                            ? "border-gray-300"
                            : "border-orange-300"
                      )}
                    >
                      {entry.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.image}
                          alt={entry.name || entry.username || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs border shadow-sm",
                        getPodiumBadgeColor(entry.rank)
                      )}
                    >
                      {entry.rank}
                    </div>
                  </div>

                  <p className="font-bold text-navy text-sm text-center truncate w-full mt-2">
                    {entry.name || entry.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400 mb-4 truncate w-full text-center">
                    {entry.username ? `@${entry.username}` : ""}
                  </p>

                  <div className="w-full space-y-1.5 border-t border-gray-100 pt-3 text-center text-xs">
                    <p className="font-extrabold text-navy text-lg">{entry.score} pts</p>
                    <div className="flex justify-center gap-3 text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Target className="w-3 h-3" />
                        {Math.round(entry.accuracy)}%
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.timeTakenInSeconds)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Remaining Rankings Table ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-navy text-lg">Full Rankings</h2>
        </div>

        {data.entries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-6 py-3.5 w-20">Rank</th>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5 text-center">Score</th>
                  <th className="px-6 py-3.5 text-center">Accuracy</th>
                  <th className="px-6 py-3.5 text-center">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.entries.map((entry) => {
                  const isCurrentUser = entry.userId === session.user?.id;

                  return (
                    <tr
                      key={entry.userId}
                      className={cn(
                        "transition-colors hover:bg-gray-50/50",
                        isCurrentUser && "bg-primary/5 font-medium hover:bg-primary/5"
                      )}
                    >
                      <td className="px-6 py-4 font-bold">
                        <div className="flex items-center justify-start gap-1">
                          {getRankIcon(entry.rank)}
                          {isCurrentUser && (
                            <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded ml-1 font-semibold">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100">
                            {entry.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={entry.image}
                                alt={entry.name || entry.username || "Avatar"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-navy font-semibold">
                              {entry.name || entry.username || "Anonymous"}
                            </p>
                            {entry.username && (
                              <p className="text-xs text-gray-400">@{entry.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-navy">{entry.score}</td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {Math.round(entry.accuracy)}%
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {formatTime(entry.timeTakenInSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No entries yet.</div>
        )}
      </div>
    </div>
  );
}
