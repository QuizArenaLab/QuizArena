import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";
import {
  getPerformanceOverview,
  getCompetitivePosition,
  getRecentAttempts,
} from "@/features/analytics/services/performance";
import { CompetitionHistoryFacade } from "@/features/competitions/history/facade/CompetitionHistoryFacade";
import { CandidateProfileFacade } from "@/features/competitions/profile/facade/CandidateProfileFacade";
import type { DefaultSession } from "next-auth";
import Link from "next/link";

import {
  Target,
  Clock,
  Flame,
  Zap,
  Trophy,
  Swords,
  TrendingUp,
  ChevronRight,
  CircleDot,
  Brain,
  Crosshair,
  Award,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Users,
  Lock,
  Activity,
} from "lucide-react";

interface UserDashboardViewProps {
  user: DefaultSession["user"] & { examCategory?: string | null; preparationLevel?: string | null };
}

/* ─── Helpers ──────────────────────────────────────────────── */

function getDifficultyStyle(difficulty: string) {
  const d = difficulty.toUpperCase();
  if (d === "HARD" || d === "EXPERT") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (d === "MEDIUM") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
}

function getAccuracyColor(accuracy: number) {
  if (accuracy >= 70) return { text: "text-emerald-400", bg: "bg-emerald-400/10" };
  if (accuracy >= 40) return { text: "text-amber-400", bg: "bg-amber-400/10" };
  return { text: "text-red-400", bg: "bg-red-400/10" };
}

function getRankBadge(rank: number | null) {
  if (!rank) return null;
  if (rank === 1)
    return {
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
      label: "🥇",
    };
  if (rank === 2)
    return {
      color: "text-gray-300",
      bg: "bg-gray-300/10",
      border: "border-gray-300/30",
      label: "🥈",
    };
  if (rank === 3)
    return {
      color: "text-amber-600",
      bg: "bg-amber-600/10",
      border: "border-amber-600/30",
      label: "🥉",
    };
  return {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    label: `#${rank}`,
  };
}

/* ─── Main Component ───────────────────────────────────────── */

export async function UserDashboardView({ user }: UserDashboardViewProps) {
  const category = user.examCategory as keyof typeof EXAM_CATEGORY_LABELS | undefined;

  const performance = user.id ? await getPerformanceOverview(user.id) : null;
  const competitivePosition = user.id ? await getCompetitivePosition(user.id) : null;
  
  // Use V2 Competition History alongside legacy
  const modernHistory = user.id ? await CompetitionHistoryFacade.getCandidateHistory(user.id) : [];
  const legacyAttempts = user.id ? await getRecentAttempts(user.id, 5) : [];
  const candidateProfile = user.id ? await CandidateProfileFacade.getProfile(user.id) : null;

  const hasHistory = (performance && performance.totalAttempts > 0) || modernHistory.length > 0;
  const hasEnoughData = performance && performance.totalAttempts >= 3;

  const checklist = [
    { title: "Create Account", completed: true },
    { title: "Complete First Challenge", completed: hasHistory },
    { title: "Unlock Analytics", completed: hasHistory && ((performance?.totalAttempts ?? 0) > 2 || modernHistory.length > 2) },
    { title: "Appear On Rankings", completed: competitivePosition?.globalRank !== null },
  ];
  const completedCount = checklist.filter((c) => c.completed).length;
  const showOnboarding = completedCount < 4;
  const progressPercent = (completedCount / 4) * 100;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
      {/* 1. HERO */}
      <section
        className="arena-hero rounded-2xl p-6 md:p-8 lg:p-10 text-white arena-section"
        style={{ animationDelay: "0ms", minHeight: 240 }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <CircleDot className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  Practice Arena Open
                </span>
              </div>
            </div>
            <>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white/80 leading-tight">
                No Scheduled Challenge
              </h1>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
                  <Swords className="w-3.5 h-3.5 text-blue-400" />
                  20 Questions
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  20 Minutes
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                  <Trophy className="w-3.5 h-3.5" />
                  Instant Ranking
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/70">
                  <Users className="w-3.5 h-3.5 text-pink-400" />
                  1,248 Participants
                </span>
              </div>
            </>
          </div>
          <div className="shrink-0 mt-4 lg:mt-0">
            <Link
              href="/arena"
              className="w-full lg:w-auto flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 text-white/80 px-8 py-3.5 rounded-xl font-bold text-base border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Target className="w-5 h-5" />
              Practice Arena
            </Link>
          </div>
        </div>
      </section>

      {/* 2. GETTING STARTED */}
      {showOnboarding && (
        <section className="arena-section" style={{ animationDelay: "60ms" }}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-navy/50 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-primary" />
                Getting Started
              </h2>
              <span className="text-xs font-bold text-navy">
                Progress: {completedCount}/4 Complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 ${item.completed ? "text-emerald-600" : "text-gray-400"}`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-semibold ${item.completed ? "text-navy" : "text-gray-500"}`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. PREPARATION SNAPSHOT */}
      <section className="arena-section" style={{ animationDelay: "120ms" }}>
        <h2 className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          Preparation Snapshot
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-orange-200 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Current Streak
              </span>
              <Flame
                className={`w-5 h-5 text-orange-500 ${hasHistory && performance?.currentStreak ? "arena-fire" : "opacity-30"}`}
              />
            </div>
            {hasHistory ? (
              <p className="text-3xl md:text-4xl font-black text-navy">
                {performance?.currentStreak || 0}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Locked</span>
                </div>
                <span className="text-[10px] font-medium text-gray-400 leading-tight">
                  Complete 1 challenge to start your streak.
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Accuracy
              </span>
              <Crosshair
                className={`w-5 h-5 text-emerald-500 ${!hasHistory ? "opacity-30" : ""}`}
              />
            </div>
            {hasHistory ? (
              <p className="text-3xl md:text-4xl font-black text-navy">
                {Math.round(performance?.averageAccuracy || 0)}%
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Locked</span>
                </div>
                <span className="text-[10px] font-medium text-gray-400 leading-tight">
                  Complete 1 challenge to see accuracy.
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Current Rank
              </span>
              <Trophy className={`w-5 h-5 text-blue-500 ${!hasHistory ? "opacity-30" : ""}`} />
            </div>
            {hasHistory && performance?.rank ? (
              <p className="text-3xl md:text-4xl font-black text-navy">#{performance.rank}</p>
            ) : (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Locked</span>
                </div>
                <span className="text-[10px] font-medium text-gray-400 leading-tight">
                  Compete to earn your first rank.
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-violet-200 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Completed
              </span>
              <CheckCircle2
                className={`w-5 h-5 text-violet-500 ${!hasHistory ? "opacity-30" : ""}`}
              />
            </div>
            {hasHistory ? (
              <p className="text-3xl md:text-4xl font-black text-navy">
                {performance?.completedAttempts || 0}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Locked</span>
                </div>
                <span className="text-[10px] font-medium text-gray-400 leading-tight">
                  Complete 1 challenge to track.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. RANKING POSITION */}
      <section className="arena-section" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-navy/50 uppercase tracking-widest flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            Your Position
          </h2>
          <Link
            href="/leaderboard"
            className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
          >
            View Rankings <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="arena-glass rounded-2xl text-white arena-shimmer overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex items-center justify-between md:flex-col md:items-start md:justify-center p-6 md:p-8">
              <p className="text-[11px] md:text-xs font-bold text-white/50 uppercase tracking-widest mb-0 md:mb-4">
                Global Rank
              </p>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
                {competitivePosition?.globalRank ? (
                  `#${competitivePosition.globalRank}`
                ) : (
                  <span className="text-white/15">—</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-start md:justify-center p-6 md:p-8">
              <p className="text-[11px] md:text-xs font-bold text-white/50 uppercase tracking-widest mb-0 md:mb-4">
                Category Rank
              </p>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
                {competitivePosition?.categoryRank ? (
                  `#${competitivePosition.categoryRank}`
                ) : (
                  <span className="text-white/15">—</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-start md:justify-center p-6 md:p-8">
              <p className="text-[11px] md:text-xs font-bold text-white/50 uppercase tracking-widest mb-0 md:mb-4">
                Percentile
              </p>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
                {competitivePosition?.percentile ? (
                  <span className="text-emerald-400">
                    Top {Math.max(1, 100 - competitivePosition.percentile)}%
                  </span>
                ) : (
                  <span className="text-white/15">—</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-start md:justify-center p-6 md:p-8">
              <p className="text-[11px] md:text-xs font-bold text-white/50 uppercase tracking-widest mb-0 md:mb-4">
                Weekly Improvement
              </p>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">
                {competitivePosition?.weeklyMovement ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />+
                    {competitivePosition.weeklyMovement}
                  </span>
                ) : (
                  <span className="text-white/15">—</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENT PERFORMANCE (V2 + Legacy) */}
      <section className="arena-section" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-navy/50 uppercase tracking-widest flex items-center gap-2">
            <Swords className="w-3.5 h-3.5" />
            Recent Competitions
          </h2>
          {(modernHistory.length > 0 || legacyAttempts.length > 0) && (
            <Link
              href="/analytics"
              className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {(modernHistory.length > 0 || legacyAttempts.length > 0) ? (
            <div className="divide-y divide-gray-50">
              {/* Render Modern History */}
              {modernHistory.slice(0, 3).map((entry) => {
                const rankBadge = getRankBadge(entry.rank);
                const accColors = getAccuracyColor(entry.percentage || 0);
                return (
                  <Link
                    href={`/dashboard/competitions/c/results`} // Simplified for MVP
                    key={entry.submissionId}
                    className="group block"
                  >
                    <div className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50/80 transition-colors">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${rankBadge ? `${rankBadge.bg} ${rankBadge.color} border ${rankBadge.border}` : "bg-gray-50 text-gray-400 border border-gray-100"}`}
                      >
                        {rankBadge ? rankBadge.label : "—"}
                      </div>
                      <div className="flex-1 min-w-0 ml-1">
                        <p className="text-base font-bold text-navy truncate group-hover:text-primary transition-colors">
                          {entry.competitionTitle}
                        </p>
                        <p className="text-xs font-medium text-gray-400 mt-1">
                          {new Date(entry.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-black text-navy">{entry.score || 0} pts</p>
                        </div>
                        <div
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold ${accColors.bg} ${accColors.text}`}
                        >
                          {entry.percentage || 0}%
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[140px]">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-3">
                <Swords className="w-5 h-5 text-navy/20" />
              </div>
              <p className="text-sm font-bold text-navy/60">No Performance Data</p>
              <p className="text-xs font-medium text-gray-400 mt-1">
                Start a competition to build your history.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. FOCUS AREA */}
      <section className="arena-section" style={{ animationDelay: "300ms" }}>
        <h2 className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Brain className="w-3.5 h-3.5" />
          Focus Area
        </h2>
        {hasEnoughData && performance?.weakestCategory ? (
          <div className="arena-glass rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Current Priority
                </p>
                <p className="text-3xl font-black text-white">
                  {EXAM_CATEGORY_LABELS[
                    performance.weakestCategory as keyof typeof EXAM_CATEGORY_LABELS
                  ] || performance.weakestCategory}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 w-full sm:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      Accuracy
                    </span>
                    <span className="text-sm font-black text-red-400">Needs Work</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      Recommended
                    </span>
                    <span className="text-sm font-black text-amber-400">High Priority</span>
                  </div>
                </div>
                <Link
                  href="/arena"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-navy rounded-xl text-sm font-black transition-all hover:scale-105 active:scale-95 uppercase tracking-wide"
                >
                  <Target className="w-4 h-4" />
                  Practice Arena
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-navy/20" />
            </div>
            <p className="text-sm font-bold text-navy/60">Locked</p>
            <p className="text-xs font-medium text-gray-400 mt-1 max-w-[240px]">
              Complete 3 challenges to unlock personalized recommendations.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
