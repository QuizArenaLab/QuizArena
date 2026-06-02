/**
 * Leaderboard — Category-based competitive rankings
 *
 * Shows per-challenge leaderboards for LIVE and ENDED challenges.
 * Protected route — requires authentication.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { prisma } from "@/lib/prisma";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";
import Link from "next/link";
import { Trophy, Medal, Clock, Target, ChevronRight, Crown, Award, Zap } from "lucide-react";

// ─── Types for queried data ────────────────────────────────────

interface LeaderboardUserEntry {
  id: string;
  rank: number;
  score: number;
  accuracy: number;
  timeTakenInSeconds: number;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

interface ChallengeWithLeaderboard {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  totalQuestions: number;
  durationInMinutes: number;
  status: string;
  leaderboardFrozen: boolean;
  leaderboard: LeaderboardUserEntry[];
  _count: { attempts: number };
}

interface UserLeaderboardEntry {
  id: string;
  rank: number;
  score: number;
  accuracy: number;
  challenge: {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    leaderboardFrozen: boolean;
  };
}

export default async function LeaderboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Get challenges with leaderboard data (LIVE for live rankings, ENDED/ARCHIVED for frozen)
  const rawChallenges = await prisma.challenge.findMany({
    where: {
      status: { in: ["LIVE", "ENDED", "ARCHIVED"] },
    },
    include: {
      leaderboard: {
        orderBy: { rank: "asc" },
        take: 3,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          attempts: {
            where: { status: "EVALUATED" },
          },
        },
      },
    },
    orderBy: { endsAt: "desc" },
    take: 10,
  });

  const challenges = rawChallenges as unknown as ChallengeWithLeaderboard[];

  // Get user's ranks across challenges
  const rawUserEntries = session.user.id
    ? await prisma.leaderboardEntry.findMany({
        where: { userId: session.user.id },
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              leaderboardFrozen: true,
            },
          },
        },
        orderBy: { frozenAt: "desc" },
      })
    : [];

  const userEntries = rawUserEntries as unknown as UserLeaderboardEntry[];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
    if (rank === 3) return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
    return "bg-gray-50 border-gray-100";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy mb-2">Leaderboard</h1>
        <p className="text-gray-500">Compete with other aspirants across challenges</p>
      </div>

      {/* Your Rankings Summary */}
      {userEntries.length > 0 && (
        <div className="bg-linear-to-br from-navy via-navy to-navy/90 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Your Rankings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userEntries.slice(0, 6).map((entry) => (
              <div key={entry.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">#{entry.rank}</span>
                  <div className="flex items-center gap-1.5">
                    {entry.challenge.category && (
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                        {
                          EXAM_CATEGORY_LABELS[
                            entry.challenge.category as keyof typeof EXAM_CATEGORY_LABELS
                          ]
                        }
                      </span>
                    )}
                    {!entry.challenge.leaderboardFrozen && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/30 text-blue-200 rounded-full flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> Live
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-white/90 truncate">
                  {entry.challenge.title}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Score: {entry.score} • Accuracy: {Math.round(entry.accuracy)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Leaderboards */}
      {challenges.length > 0 ? (
        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Challenge Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-navy">{challenge.title}</h3>
                      {!challenge.leaderboardFrozen && challenge.status === "LIVE" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" /> Live Rankings
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        {challenge.totalQuestions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {challenge.durationInMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        {challenge._count.attempts} participants
                      </span>
                    </div>
                  </div>
                  {challenge.category && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {
                        EXAM_CATEGORY_LABELS[
                          challenge.category as keyof typeof EXAM_CATEGORY_LABELS
                        ]
                      }
                    </span>
                  )}
                </div>
              </div>

              {/* Top 3 */}
              {challenge.leaderboard.length > 0 ? (
                <div className="p-4">
                  <div className="space-y-2">
                    {challenge.leaderboard.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between p-3 rounded-xl border ${getRankBg(entry.rank)}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div>
                            <p className="font-semibold text-navy text-sm">
                              {entry.user.name || entry.user.username || "Anonymous"}
                            </p>
                            {entry.user.username && (
                              <p className="text-xs text-gray-400">@{entry.user.username}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-navy">{entry.score}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(entry.accuracy)}% •{" "}
                            {Math.floor(entry.timeTakenInSeconds / 60)}m{" "}
                            {entry.timeTakenInSeconds % 60}s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {challenge._count.attempts > 3 && (
                    <Link
                      href={`/leaderboard/${challenge.slug}`}
                      className="mt-3 flex items-center justify-center gap-1.5 text-primary font-medium text-sm hover:underline py-2"
                    >
                      View all {challenge._count.attempts} participants
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">No participants yet</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-3">No completed challenges yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Rankings appear after challenges end. Complete a challenge to see how you stack up
            against other aspirants.
          </p>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View available challenges <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
