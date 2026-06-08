"use server";

import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceOverview {
  currentStreak: number;
  longestStreak: number;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  averageAccuracy: number;
  totalAnswered: number;
  strongestCategory: string | null;
  weakestCategory: string | null;
  rank: number | null;
}

export interface TrendDataPoint {
  date: string;
  accuracy: number;
  score: number;
}

export interface WeakArea {
  category: string;
  accuracy: number;
}

export interface CompetitivePosition {
  globalRank: number | null;
  categoryRank: number | null;
  percentile: number;
  weeklyMovement: number;
}

export interface RecentAttempt {
  id: string;
  challengeName: string;
  score: number;
  accuracy: number;
  rankAchieved: number | null;
  submittedAt: Date | null;
}

// ============================================================================
// ANALYTICS INTELLIGENCE TYPES
// ============================================================================

export interface AnalyticsWeakness {
  weakestCategory: string;
  categoryAccuracy: number;
  averageAccuracy: number;
  differenceFromAverage: number;
  priority: "HIGH" | "MEDIUM";
}

export interface AnalyticsCategory {
  category: string;
  accuracy: number;
  attemptCount: number;
  status: "Strong Area" | "Needs Improvement" | "Getting Started";
}

export interface AnalyticsAction {
  title: string;
  reason: string;
  expectedImpact: string;
  type: "practice" | "speed" | "continue";
  category: string;
}

export interface AnalyticsIntelligence {
  maturityLevel: number;
  snapshot: {
    totalAttempts: number;
    overallAccuracy: number;
    currentStreak: number;
    currentRank: number | null;
    accuracyDelta: number | null;
    bestRank: number | null;
    bestAccuracy: number | null;
  };
  weakness: AnalyticsWeakness | null;
  categories: AnalyticsCategory[];
  trendData: Array<{ date: string; accuracy: number }>;
  actions: AnalyticsAction[];
}

// ============================================================================
// ANALYTICS INTELLIGENCE — Consolidated Action
// ============================================================================

export async function getAnalyticsIntelligence(userId: string): Promise<AnalyticsIntelligence> {
  // Fetch all data in parallel
  const [profile, bestRankEntry, latestRankEntry, bestAccuracyEntry, categoryPerfs, trendAttempts] =
    await Promise.all([
      prisma.userPerformanceProfile.findUnique({ where: { userId } }),
      prisma.leaderboardEntry.findFirst({
        where: { userId },
        orderBy: { rank: "asc" },
      }),
      prisma.leaderboardEntry.findFirst({
        where: { userId },
        orderBy: { submittedAt: "desc" },
      }),
      prisma.leaderboardEntry.findFirst({
        where: { userId },
        orderBy: { accuracy: "desc" },
      }),
      prisma.userCategoryPerformance.findMany({
        where: { userId },
        orderBy: { totalAttempts: "desc" },
      }),
      prisma.attempt.findMany({
        where: {
          userId,
          status: AttemptStatus.EVALUATED,
          submittedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { submittedAt: "asc" },
        select: {
          submittedAt: true,
          correctAnswers: true,
          totalAnswered: true,
        },
      }),
    ]);

  const totalAttempts = profile?.totalAttempts ?? 0;
  const overallAccuracy = profile?.averageAccuracy ?? 0;

  // ── Maturity Level ──
  let maturityLevel = 0;
  if (totalAttempts >= 20) maturityLevel = 4;
  else if (totalAttempts >= 10) maturityLevel = 3;
  else if (totalAttempts >= 4) maturityLevel = 2;
  else if (totalAttempts >= 1) maturityLevel = 1;

  // ── Trend Data (grouped by day) ──
  const grouped: Record<string, { totalCorrect: number; totalAnswered: number }> = {};
  for (const a of trendAttempts) {
    if (!a.submittedAt) continue;
    const day = a.submittedAt.toISOString().split("T")[0];
    if (!grouped[day]) grouped[day] = { totalCorrect: 0, totalAnswered: 0 };
    grouped[day].totalCorrect += a.correctAnswers;
    grouped[day].totalAnswered += a.totalAnswered || 1;
  }
  const trendData = Object.entries(grouped).map(([date, d]) => ({
    date,
    accuracy: Math.round((d.totalCorrect / d.totalAnswered) * 100),
  }));

  // ── Accuracy Delta (compare last 7 days vs. prior 7 days) ──
  let accuracyDelta: number | null = null;
  if (trendData.length >= 2) {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    const recentPoints = trendData.filter((t) => new Date(t.date).getTime() >= sevenDaysAgo);
    const priorPoints = trendData.filter((t) => {
      const ts = new Date(t.date).getTime();
      return ts >= fourteenDaysAgo && ts < sevenDaysAgo;
    });

    if (recentPoints.length > 0 && priorPoints.length > 0) {
      const recentAvg = recentPoints.reduce((s, p) => s + p.accuracy, 0) / recentPoints.length;
      const priorAvg = priorPoints.reduce((s, p) => s + p.accuracy, 0) / priorPoints.length;
      accuracyDelta = Math.round(recentAvg - priorAvg);
    }
  }

  // ── Snapshot ──
  const snapshot = {
    totalAttempts,
    overallAccuracy: Math.round(overallAccuracy),
    currentStreak: profile?.currentStreak ?? 0,
    currentRank: latestRankEntry?.rank ?? null,
    accuracyDelta,
    bestRank: bestRankEntry?.rank ?? null,
    bestAccuracy: bestAccuracyEntry ? Math.round(bestAccuracyEntry.accuracy) : null,
  };

  // ── Weakness Detection ──
  let weakness: AnalyticsWeakness | null = null;
  if (maturityLevel >= 2 && categoryPerfs.length > 0) {
    // Find weakest category with at least 3 attempts
    const eligible = categoryPerfs.filter((c) => c.totalAttempts >= 3);
    if (eligible.length > 0) {
      const weakest = eligible.reduce((prev, curr) =>
        curr.averageAccuracy < prev.averageAccuracy ? curr : prev
      );
      const diff = Math.round(overallAccuracy - weakest.averageAccuracy);
      if (diff > 0) {
        weakness = {
          weakestCategory: weakest.category,
          categoryAccuracy: Math.round(weakest.averageAccuracy),
          averageAccuracy: Math.round(overallAccuracy),
          differenceFromAverage: diff,
          priority: diff >= 15 ? "HIGH" : "MEDIUM",
        };
      }
    }
  }

  // ── Category Intelligence ──
  const categories: AnalyticsCategory[] = categoryPerfs.map((c) => ({
    category: c.category,
    accuracy: Math.round(c.averageAccuracy),
    attemptCount: c.totalAttempts,
    status:
      c.averageAccuracy >= 70
        ? "Strong Area"
        : c.totalAttempts < 3
          ? "Getting Started"
          : "Needs Improvement",
  }));

  // ── Actions (Action Center) ──
  const actions: AnalyticsAction[] = [];
  if (maturityLevel >= 4) {
    // 1. Weakest category action
    if (weakness) {
      actions.push({
        title: `Practice ${weakness.weakestCategory}`,
        reason: `Accuracy is ${weakness.differenceFromAverage}% below your average.`,
        expectedImpact: `+${Math.min(3, Math.round(weakness.differenceFromAverage / 3))}% Overall Accuracy`,
        type: "practice",
        category: weakness.weakestCategory,
      });
    }

    // 2. Speed / medium performer action
    const mediumPerformers = categories
      .filter((c) => c.accuracy >= 50 && c.accuracy < 70 && c.attemptCount >= 3)
      .sort((a, b) => a.accuracy - b.accuracy);
    if (mediumPerformers.length > 0) {
      const target = mediumPerformers[0];
      actions.push({
        title: `Improve speed in ${target.category}`,
        reason: `Shows understanding at ${target.accuracy}%, needs consistency.`,
        expectedImpact: "Faster clear times",
        type: "speed",
        category: target.category,
      });
    }

    // 3. Strongest category action
    const strongest = categories
      .filter((c) => c.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy);
    if (strongest.length > 0) {
      actions.push({
        title: `Continue ${strongest[0].category} practice`,
        reason: `Current accuracy of ${strongest[0].accuracy}% is a strong advantage.`,
        expectedImpact: "Maintain competitive edge",
        type: "continue",
        category: strongest[0].category,
      });
    }
  }

  return {
    maturityLevel,
    snapshot,
    weakness,
    categories,
    trendData,
    actions: actions.slice(0, 3),
  };
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

export async function getPerformanceOverview(userId: string): Promise<PerformanceOverview> {
  const { AnalyticsService } = await import("@/features/analytics/services/analytics.service");
  const snapshot = await AnalyticsService.getPerformanceSnapshot(userId);

  return {
    currentStreak: snapshot.currentStreak,
    longestStreak: snapshot.highestStreak,
    totalAttempts: snapshot.totalAttempts,
    completedAttempts: snapshot.competitionsPlayed, // Legacy mapping
    averageScore: 0, // Legacy field, not used in critical UI
    averageAccuracy: snapshot.overallAccuracy,
    totalAnswered: 0, // Legacy field, not used in critical UI
    strongestCategory: snapshot.bestCategory,
    weakestCategory: snapshot.weakestCategory,
    rank: snapshot.currentRank,
  };
}

export async function getCategoryAnalytics(userId: string) {
  return prisma.userCategoryPerformance.findMany({
    where: { userId },
    orderBy: { totalAttempts: "desc" },
  });
}

export async function generatePerformanceTrends(
  userId: string,
  days: number = 30
): Promise<TrendDataPoint[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      status: AttemptStatus.EVALUATED,
      submittedAt: { gte: cutoffDate },
    },
    orderBy: { submittedAt: "asc" },
    select: {
      submittedAt: true,
      score: true,
      correctAnswers: true,
      totalAnswered: true,
    },
  });

  // Group by day (YYYY-MM-DD)
  const grouped = attempts.reduce(
    (acc, curr) => {
      if (!curr.submittedAt) return acc;
      const day = curr.submittedAt.toISOString().split("T")[0];
      if (!acc[day]) {
        acc[day] = { totalScore: 0, totalCorrect: 0, totalAnswered: 0, count: 0 };
      }
      acc[day].totalScore += curr.score;
      acc[day].totalCorrect += curr.correctAnswers;
      acc[day].totalAnswered += curr.totalAnswered || 1; // fallback to 1 to avoid /0
      acc[day].count += 1;
      return acc;
    },
    {} as Record<
      string,
      { totalScore: number; totalCorrect: number; totalAnswered: number; count: number }
    >
  );

  return Object.entries(grouped).map(([date, data]) => ({
    date,
    accuracy: Math.round((data.totalCorrect / data.totalAnswered) * 100),
    score: Math.round(data.totalScore / data.count),
  }));
}

export async function detectWeakAreas(userId: string): Promise<WeakArea[]> {
  const categories = await prisma.userCategoryPerformance.findMany({
    where: {
      userId,
      totalAttempts: { gte: 3 }, // Require at least 3 attempts to establish a pattern
    },
    orderBy: { averageAccuracy: "asc" },
    take: 3,
  });

  return categories
    .filter((cat) => cat.averageAccuracy < 60) // Threshold for weakness
    .map((cat) => ({
      category: cat.category,
      accuracy: Math.round(cat.averageAccuracy),
    }));
}

export async function getCompetitivePosition(userId: string): Promise<CompetitivePosition> {
  const { LeaderboardService } = await import("@/features/analytics/services/leaderboard.service");

  // Best rank entry gives us our "Global" best if not filtering by category
  const bestRankEntry = await prisma.leaderboardEntry.findFirst({
    where: { userId },
    orderBy: { rank: "asc" },
  });

  // Calculate approximate percentile based on total users on leaderboard
  let percentile = 0;
  if (bestRankEntry && bestRankEntry.rank > 0) {
    const totalUsers = await LeaderboardService.getChallengeParticipantCount(
      bestRankEntry.challengeId
    );
    if (totalUsers > 1) {
      percentile = Math.max(0, Math.round(100 - (bestRankEntry.rank / totalUsers) * 100));
    }
  }

  // Placeholder for weekly movement, could be calculated by comparing historical snapshots
  const weeklyMovement = bestRankEntry ? 12 : 0;

  return {
    globalRank: bestRankEntry?.rank || null,
    categoryRank: bestRankEntry?.rank || null, // Mocking category rank as global for now
    percentile,
    weeklyMovement,
  };
}

export async function getRecentAttempts(
  userId: string,
  limit: number = 5
): Promise<RecentAttempt[]> {
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      status: AttemptStatus.EVALUATED,
    },
    include: {
      challenge: {
        select: { title: true, totalQuestions: true },
      },
      leaderboardEntry: {
        select: { rank: true },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
    take: limit,
  });

  return attempts.map((a) => ({
    id: a.id,
    challengeName: a.challenge.title,
    score: a.score,
    accuracy:
      a.totalAnswered > 0 ? Math.round((a.correctAnswers / a.challenge.totalQuestions) * 100) : 0,
    rankAchieved: a.leaderboardEntry?.rank || null,
    submittedAt: a.submittedAt,
  }));
}

// ============================================================================
// WRITE OPERATIONS (DETERMINISTIC STREAKS & AGGREGATIONS)
// ============================================================================

export async function updatePerformanceAggregations(userId: string, attemptId: string) {
  // 1. Fetch the attempt
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { challenge: true },
  });

  if (!attempt || attempt.status !== AttemptStatus.EVALUATED || !attempt.submittedAt) {
    return;
  }

  const category = attempt.challenge.category || "GENERAL";

  // 2. Wrap aggregations in a transaction
  await prisma.$transaction(async (tx) => {
    // A. Update or create the profile
    let profile = await tx.userPerformanceProfile.findUnique({
      where: { userId },
    });

    const now = new Date();

    // Default initialization
    if (!profile) {
      profile = await tx.userPerformanceProfile.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastParticipationAt: attempt.submittedAt,
          totalAttempts: 1,
          completedAttempts: 1,
          averageScore: attempt.score,
          averageAccuracy: attempt.totalAnswered
            ? (attempt.correctAnswers / attempt.totalAnswered) * 100
            : 0,
          totalCorrect: attempt.correctAnswers,
          totalAnswered: attempt.totalAnswered,
          strongestCategory: category,
          weakestCategory: null,
        },
      });
    } else {
      // Calculate streak deterministically
      let newStreak = profile.currentStreak;
      if (profile.lastParticipationAt) {
        const msSinceLast = attempt.submittedAt!.getTime() - profile.lastParticipationAt.getTime();
        const hoursSinceLast = msSinceLast / (1000 * 60 * 60);

        if (hoursSinceLast > 24 && hoursSinceLast <= 48) {
          // Continued streak
          newStreak += 1;
        } else if (hoursSinceLast > 48) {
          // Broken streak
          newStreak = 1;
        }
        // If < 24 hours (same day), streak remains the same.
      } else {
        newStreak = 1;
      }

      const newTotalCorrect = profile.totalCorrect + attempt.correctAnswers;
      const newTotalAnswered = profile.totalAnswered + attempt.totalAnswered;
      const newCompleted = profile.completedAttempts + 1;
      const newAccuracy = newTotalAnswered > 0 ? (newTotalCorrect / newTotalAnswered) * 100 : 0;

      // We must recalculate averageScore by querying overall or just doing incremental. Incremental:
      const newAverageScore =
        (profile.averageScore * profile.completedAttempts + attempt.score) / newCompleted;

      profile = await tx.userPerformanceProfile.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(profile.longestStreak, newStreak),
          lastParticipationAt: attempt.submittedAt,
          totalAttempts: profile.totalAttempts + 1,
          completedAttempts: newCompleted,
          totalCorrect: newTotalCorrect,
          totalAnswered: newTotalAnswered,
          averageAccuracy: newAccuracy,
          averageScore: newAverageScore,
        },
      });
    }

    // B. Update or create the category performance
    const catPerf = await tx.userCategoryPerformance.findUnique({
      where: { userId_category: { userId, category } },
    });

    if (!catPerf) {
      await tx.userCategoryPerformance.create({
        data: {
          userId,
          category,
          totalAttempts: 1,
          averageScore: attempt.score,
          averageAccuracy: attempt.totalAnswered
            ? (attempt.correctAnswers / attempt.totalAnswered) * 100
            : 0,
          totalCorrect: attempt.correctAnswers,
          totalAnswered: attempt.totalAnswered,
          lastAttemptAt: attempt.submittedAt,
        },
      });
    } else {
      const cNewCorrect = catPerf.totalCorrect + attempt.correctAnswers;
      const cNewAnswered = catPerf.totalAnswered + attempt.totalAnswered;
      const cNewCompleted = catPerf.totalAttempts + 1;
      const cNewAccuracy = cNewAnswered > 0 ? (cNewCorrect / cNewAnswered) * 100 : 0;
      const cNewAvgScore =
        (catPerf.averageScore * catPerf.totalAttempts + attempt.score) / cNewCompleted;

      await tx.userCategoryPerformance.update({
        where: { id: catPerf.id },
        data: {
          totalAttempts: cNewCompleted,
          totalCorrect: cNewCorrect,
          totalAnswered: cNewAnswered,
          averageAccuracy: cNewAccuracy,
          averageScore: cNewAvgScore,
          lastAttemptAt: attempt.submittedAt,
        },
      });
    }

    // C. Determine strongest and weakest category after updates
    const allCatPerfs = await tx.userCategoryPerformance.findMany({
      where: { userId },
      orderBy: { averageAccuracy: "desc" },
    });

    if (allCatPerfs.length > 0) {
      const strongest = allCatPerfs[0].category;
      const weakest = allCatPerfs[allCatPerfs.length - 1].category;

      await tx.userPerformanceProfile.update({
        where: { userId },
        data: {
          strongestCategory: strongest,
          weakestCategory: allCatPerfs.length > 1 ? weakest : null, // Only have a weak category if more than 1 category or enough attempts
        },
      });
    }
  });

  // Generate the snapshot for O(1) reads
  const { AnalyticsService } = await import("@/features/analytics/services/analytics.service");
  await AnalyticsService.updateSnapshotAfterEvaluation(userId);

  revalidatePath("/dashboard/home");
  revalidatePath("/analytics");
}
