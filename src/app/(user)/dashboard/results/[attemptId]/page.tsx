/**
 * Results Page — Server Component
 *
 * Competitive result display powered by getEvaluationResult().
 * Shows: score hero, stats grid, rank card, question review, and action CTAs.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getEvaluationResult } from "@/actions/evaluation";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  Target,
  BarChart3,
  ArrowRight,
  RotateCcw,
  Medal,
  Lock,
  Crown,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const { attemptId } = await params;
  const result = await getEvaluationResult(attemptId);

  if (!result) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Result Not Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find this result. It may not exist or you may not have access.
          </p>
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to Arena
          </Link>
        </div>
      </div>
    );
  }

  const accuracy = Math.round(result.accuracy);
  const timeTaken = result.timeTakenInSeconds;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const getPerformanceTier = () => {
    if (accuracy >= 90)
      return {
        label: "Outstanding Performance",
        color: "text-emerald-600",
        bg: "from-emerald-500/10 to-emerald-500/5",
        icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
      };
    if (accuracy >= 70)
      return {
        label: "Strong Performance",
        color: "text-blue-600",
        bg: "from-blue-500/10 to-blue-500/5",
        icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      };
    if (accuracy >= 50)
      return {
        label: "Moderate Performance",
        color: "text-amber-600",
        bg: "from-amber-500/10 to-amber-500/5",
        icon: <Zap className="w-8 h-8 text-amber-500" />,
      };
    return {
      label: "Keep Practicing",
      color: "text-gray-600",
      bg: "from-gray-500/10 to-gray-500/5",
      icon: <Target className="w-8 h-8 text-gray-400" />,
    };
  };

  const performance = getPerformanceTier();
  const challengeEnded =
    result.challengeStatus === "ENDED" || result.challengeStatus === "ARCHIVED";

  const getPercentile = () => {
    if (!result.rank || result.totalParticipants <= 0) return null;
    return Math.round(((result.totalParticipants - result.rank) / result.totalParticipants) * 100);
  };

  const percentile = getPercentile();

  return (
    <div className="py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ─── HERO SCORE CARD ──────────────────────────────── */}
        <div
          className={cn(
            "relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
          )}
        >
          {/* Performance gradient accent */}
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-40 pointer-events-none",
              performance.bg
            )}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                {performance.icon}
              </div>
              <h1 className={cn("text-2xl sm:text-3xl font-bold mb-2", performance.color)}>
                {performance.label}
              </h1>
              <p className="text-gray-500">{result.challengeTitle}</p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-3xl font-bold text-navy">{result.score}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Score</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-3xl font-bold text-emerald-600">{result.correctAnswers}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1">Correct</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-3xl font-bold text-red-600">{result.wrongAnswers}</p>
                <p className="text-xs font-medium text-red-600 mt-1">Wrong</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-3xl font-bold text-navy">{accuracy}%</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Accuracy</p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100">
                <Clock className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Time Taken</p>
                  <p className="font-bold text-navy text-sm">
                    {minutes}m {seconds}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100">
                <Target className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Total Questions</p>
                  <p className="font-bold text-navy text-sm">{result.totalQuestions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100">
                <MinusCircle className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Unanswered</p>
                  <p className="font-bold text-navy text-sm">{result.unansweredCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RANK CARD ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-navy">Your Ranking</h2>
          </div>

          {result.rank !== null ? (
            <div
              className={cn(
                "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border gap-4",
                result.isRankFrozen
                  ? "bg-linear-to-r from-amber-50 to-orange-50 border-amber-200"
                  : "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    result.rank <= 3 ? "bg-amber-100" : "bg-white border border-gray-200"
                  )}
                >
                  {result.rank === 1 ? (
                    <Crown className="w-7 h-7 text-amber-500" />
                  ) : (
                    <span className="text-2xl font-bold text-navy">#{result.rank}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-navy">
                    Rank {result.rank} of {result.totalParticipants}
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.rank <= 3
                      ? "🏆 Top performer!"
                      : percentile !== null && percentile >= 90
                        ? `Top ${100 - percentile}% — Excellent!`
                        : percentile !== null && percentile >= 75
                          ? `Top ${100 - percentile}% — Great job!`
                          : percentile !== null && percentile >= 50
                            ? `Top ${100 - percentile}% — Well done!`
                            : "Keep practicing to improve your rank"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {result.isRankFrozen ? (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Finalized
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Live Ranking
                  </span>
                )}
                {challengeEnded && (
                  <Link
                    href={`/leaderboard/${result.challengeSlug}`}
                    className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    Full Leaderboard <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ) : !challengeEnded ? (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Lock className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="font-medium text-navy">Rankings will update as others submit</p>
                <p className="text-sm text-gray-500">
                  Your score has been recorded. Check back for live ranking updates.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Leaderboard data not available for this challenge.
            </div>
          )}
        </div>

        {/* ─── QUESTION-BY-QUESTION REVIEW ──────────────────── */}
        <QuestionReview questions={result.questions} />

        {/* ─── ACTIONS ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md hover:shadow-primary/20"
          >
            <RotateCcw className="w-4 h-4" />
            Try Another Challenge
          </Link>
          {challengeEnded && (
            <Link
              href={`/leaderboard/${result.challengeSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-navy font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              View Leaderboard
            </Link>
          )}
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-navy font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Return to Arena
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Question Review Sub-Component (Client) ─────────────────────

import type { QuestionResultDetail } from "@/types/challenge";
import { QuestionReviewClient } from "./QuestionReviewClient";

function QuestionReview({ questions }: { questions: QuestionResultDetail[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-navy" />
          <h2 className="text-lg font-bold text-navy">Question Review</h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-3.5 h-3.5" /> Wrong
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <MinusCircle className="w-3.5 h-3.5" /> Skipped
          </span>
        </div>
      </div>

      <QuestionReviewClient questions={questions} />
    </div>
  );
}
