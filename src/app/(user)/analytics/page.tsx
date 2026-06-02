import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Award,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Lock,
  Lightbulb,
  Zap,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { getAnalyticsIntelligence, type AnalyticsIntelligence } from "@/features/analytics/services/performance";
import { PerformanceTrendChart } from "@/features/analytics/components/PerformanceTrendChart";

// ── Preview mock data for UI testing ──
function getPreviewData(): AnalyticsIntelligence {
  const today = new Date();
  const trendData = Array.from({ length: 18 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (17 - i));
    return {
      date: d.toISOString().split("T")[0],
      accuracy: Math.round(58 + Math.random() * 30 + i * 0.8),
    };
  });

  return {
    maturityLevel: 4,
    snapshot: {
      totalAttempts: 42,
      overallAccuracy: 74,
      currentStreak: 5,
      currentRank: 12,
      accuracyDelta: 3,
      bestRank: 3,
      bestAccuracy: 88,
    },
    weakness: {
      weakestCategory: "Quantitative Aptitude",
      categoryAccuracy: 61,
      averageAccuracy: 74,
      differenceFromAverage: 13,
      priority: "HIGH",
    },
    categories: [
      {
        category: "Reasoning",
        accuracy: 82,
        attemptCount: 14,
        status: "Strong Area",
      },
      {
        category: "English",
        accuracy: 75,
        attemptCount: 11,
        status: "Strong Area",
      },
      {
        category: "General Awareness",
        accuracy: 68,
        attemptCount: 9,
        status: "Needs Improvement",
      },
      {
        category: "Quantitative Aptitude",
        accuracy: 61,
        attemptCount: 8,
        status: "Needs Improvement",
      },
    ],
    trendData,
    actions: [
      {
        title: "Practice Quantitative Aptitude",
        reason: "Accuracy is 13% below your average.",
        expectedImpact: "+4% Overall Accuracy",
        type: "practice",
        category: "Quantitative Aptitude",
      },
      {
        title: "Improve speed in General Awareness",
        reason: "Shows understanding at 68%, needs consistency.",
        expectedImpact: "Faster clear times",
        type: "speed",
        category: "General Awareness",
      },
      {
        title: "Continue Reasoning practice",
        reason: "Current accuracy of 82% is a strong advantage.",
        expectedImpact: "Maintain competitive edge",
        type: "continue",
        category: "Reasoning",
      },
    ],
  };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const params = await searchParams;
  const isPreview = params.preview === "true";

  const data = isPreview ? getPreviewData() : await getAnalyticsIntelligence(session.user.id);
  const { maturityLevel, snapshot, weakness, categories, trendData, actions } = data;

  // ── Level 0: Analytics Locked ──
  if (maturityLevel === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Coach</h1>
          <p className="text-gray-500 mt-1">
            Complete challenges to unlock personalized preparation intelligence.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Intelligence Locked</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We need at least 1 completed challenge to establish your performance baseline. Take a
              challenge to unlock your Preparation Status Hero.
            </p>
            <Link href="/challenges" className="btn btn-primary btn-lg gap-2">
              Start First Challenge <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topCategories = [...categories]
    .filter((c) => c.attemptCount > 0)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3);
  const bottomCategories = [...categories]
    .filter((c) => c.attemptCount > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Coach</h1>
        <p className="text-gray-500 mt-1">
          Your personalized preparation intelligence and next actions.
        </p>
      </div>

      {/* ── SECTION 1: PREPARATION STATUS HERO ── */}
      <section className="analytics-section bg-[#1b2234] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
          <Target className="w-64 h-64" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-indigo-200 font-medium text-sm tracking-wide uppercase mb-1">
              Overall Accuracy
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tighter">
                {snapshot.overallAccuracy}%
              </span>
              {snapshot.accuracyDelta !== null && snapshot.accuracyDelta !== 0 && (
                <span
                  className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                    snapshot.accuracyDelta > 0
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {snapshot.accuracyDelta > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(snapshot.accuracyDelta)}% this week
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-8 md:justify-end">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Current Rank</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {snapshot.currentRank ? `#${snapshot.currentRank}` : "Unranked"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-indigo-200 text-sm mb-1">Streak</p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold">{snapshot.currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PRIORITY FOCUS ── */}
      <section className="analytics-section">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-3">
          Priority Focus
        </h2>

        {maturityLevel >= 2 ? (
          weakness ? (
            <div className="bg-white rounded-2xl border-2 border-red-100 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{weakness.weakestCategory}</h3>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      HIGH IMPACT
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Accuracy is{" "}
                    <span className="font-semibold text-red-600">
                      {weakness.differenceFromAverage}% below
                    </span>{" "}
                    your average. Practicing this will yield the highest rating increase.
                  </p>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-gray-500">Current: {weakness.categoryAccuracy}%</span>
                    <span className="text-gray-500">Average: {weakness.averageAccuracy}%</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/challenges?category=${encodeURIComponent(weakness.weakestCategory)}`}
                className="btn bg-red-500 hover:bg-red-600 text-white w-full md:w-auto px-8 whitespace-nowrap"
              >
                Practice Category
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center min-h-[160px]">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Balanced Performance</h3>
              <p className="text-gray-500 text-sm">
                No significant weaknesses detected. Keep practicing across all categories to
                maintain your edge.
              </p>
            </div>
          )
        ) : (
          <div className="analytics-locked rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center relative">
            <Lock className="w-8 h-8 text-gray-400 mb-3 relative z-10" />
            <h3 className="font-semibold text-gray-900 mb-1 relative z-10">
              Priority Focus Locked
            </h3>
            <p className="text-sm text-gray-500 relative z-10">
              Complete {4 - snapshot.totalAttempts} more attempts to unlock.
            </p>
          </div>
        )}
      </section>

      {/* ── SECTION 4: PERFORMANCE JOURNEY (Sparkline) ── */}
      <section className="analytics-section">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-3">
          Performance Journey
        </h2>
        {maturityLevel >= 1 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {trendData.length >= 2 ? (
              <PerformanceTrendChart data={trendData} />
            ) : (
              <div className="h-20 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-6 h-6 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Not enough historical data to map journey.</p>
              </div>
            )}
          </div>
        ) : null}
      </section>

      {/* ── SECTION 5: ACTION CENTER ── */}
      <section className="analytics-section">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-3">
          Action Center
        </h2>

        {maturityLevel >= 4 ? (
          <div className="space-y-3">
            {actions.length > 0 ? (
              actions.map((action, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:border-indigo-100 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <div className="mt-1">
                      {action.type === "practice" && <Target className="w-5 h-5 text-indigo-500" />}
                      {action.type === "speed" && <Zap className="w-5 h-5 text-yellow-500" />}
                      {action.type === "continue" && (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-0.5">{action.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{action.reason}</p>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">
                        Impact: {action.expectedImpact}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/challenges?category=${encodeURIComponent(action.category)}`}
                    className="btn btn-outline text-sm whitespace-nowrap w-full md:w-auto"
                  >
                    Start Practice
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
                No specific actions recommended at this time. Keep practicing!
              </div>
            )}
          </div>
        ) : (
          <div className="analytics-locked rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center relative">
            <Lock className="w-8 h-8 text-gray-400 mb-3 relative z-10" />
            <h3 className="font-semibold text-gray-900 mb-1 relative z-10">Action Center Locked</h3>
            <p className="text-sm text-gray-500 relative z-10">
              Complete {20 - snapshot.totalAttempts} more attempts to unlock.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
