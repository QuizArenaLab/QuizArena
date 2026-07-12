// @ts-nocheck
"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import { $Enums } from "@/generated/prisma";

async function validateAdminAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }

  const userRole = (session.user.role as string) || "USER";

  if (!hasMinimumRole(userRole, ROLE.ADMIN)) {
    throw new Error("Access denied: Admin role required");
  }

  return session;
}

function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getStartOfWeek(date: Date = new Date()): Date {
  const start = new Date(date);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

export interface PlatformHealthMetrics {
  activeChallenges: number;
  scheduledChallenges: number;
  publishedChallenges: number;
  pendingModeration: number;
  totalActiveUsers: number;
  challengesCompletedToday: number;
  moderationBacklog: number;
}

export interface ModerationQueueMetrics {
  pendingReviews: number;
  rejectedChallenges: number;
  flaggedQuestions: number;
  queueCount: number;
  recentReviewActivity: Array<{
    id: string;
    type: "challenge" | "question";
    title: string;
    status: string;
    updatedAt: Date;
    reviewedBy: string | null;
  }>;
}

export interface ModeratorActivityMetrics {
  challengesCreatedToday: number;
  approvalsCompleted: number;
  moderationThroughput: number;
  reviewerActivity: Array<{
    moderatorId: string;
    moderatorName: string;
    reviewsCompleted: number;
    lastActivity: Date | null;
  }>;
  contentContribution: {
    totalChallengesCreated: number;
    totalQuestionsCreated: number;
  };
}

export interface UserActivityMetrics {
  dailyActiveUsers: number;
  challengeParticipation: number;
  completionRate: number;
  dropOffIndicators: {
    startedNotCompleted: number;
    averageDropOffPoint: number;
  };
  streakActivity: {
    activeStreaks: number;
    longestStreak: number;
  };
}

export interface SystemAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  actionUrl?: string;
}

export interface AdminDashboardData {
  platformHealth: PlatformHealthMetrics;
  moderationQueue: ModerationQueueMetrics;
  moderatorActivity: ModeratorActivityMetrics;
  userActivity: UserActivityMetrics;
  alerts: SystemAlert[];
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    user: string | null;
  }>;
  engagementTrends: Array<{ date: string; attempts: number; uniqueUsers: number }>;
}

export async function getPlatformHealthMetrics(): Promise<PlatformHealthMetrics> {
  await validateAdminAccess();

  const todayStart = getStartOfDay();
  const now = new Date();

  const [
    activeChallenges,
    scheduledChallenges,
    publishedChallenges,
    pendingModeration,
    totalActiveUsers,
    challengesCompletedToday,
    moderationBacklog,
  ] = await Promise.all([
    prisma.challenge.count({
      where: {
        status: { in: [$Enums.ChallengeStatus.LIVE, $Enums.ChallengeStatus.SCHEDULED] },
      },
    }),
    prisma.challenge.count({
      where: { status: $Enums.ChallengeStatus.SCHEDULED, startsAt: { gt: now } },
    }),
    prisma.challenge.count({ where: { status: $Enums.ChallengeStatus.LIVE } }),
    prisma.challenge.count({ where: { status: $Enums.ChallengeStatus.DRAFT } }),
    prisma.user.count({
      where: {
        role: "USER",
        attempts: {
          some: {
            startedAt: { gte: todayStart },
          },
        },
      },
    }),
    prisma.attempt.count({
      where: { submittedAt: { gte: todayStart } },
    }),
    prisma.question.count({ where: { status: $Enums.QuestionStatus.REVIEW } }),
  ]);

  return {
    activeChallenges,
    scheduledChallenges,
    publishedChallenges,
    pendingModeration,
    totalActiveUsers,
    challengesCompletedToday,
    moderationBacklog,
  };
}

export async function getModerationQueueMetrics(): Promise<ModerationQueueMetrics> {
  await validateAdminAccess();

  const [pendingReviews, rejectedChallenges, flaggedQuestions, recentReviews] = await Promise.all([
    prisma.challenge.count({ where: { status: $Enums.ChallengeStatus.DRAFT } }),
    prisma.challenge.count({
      where: {
        status: "DRAFT",
        updatedAt: { gte: getStartOfWeek() },
      },
    }),
    prisma.question.count({ where: { status: $Enums.QuestionStatus.REVIEW } }),
    prisma.challenge.findMany({
      where: {
        status: { in: [$Enums.ChallengeStatus.LIVE, $Enums.ChallengeStatus.ARCHIVED] },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        reviewedById: true,
      },
    }),
  ]);

  const reviewerIds = recentReviews
    .filter((r) => r.reviewedById)
    .map((r) => r.reviewedById as string);
  const reviewers = await prisma.user.findMany({
    where: { id: { in: reviewerIds } },
    select: { id: true, name: true },
  });
  const reviewerMap = new Map(reviewers.map((r) => [r.id, r.name]));

  const recentReviewActivity = recentReviews.map((review) => ({
    id: review.id,
    type: "challenge" as const,
    title: review.title,
    status: review.status,
    updatedAt: review.updatedAt,
    reviewedBy: review.reviewedById ? (reviewerMap.get(review.reviewedById) ?? null) : null,
  }));

  return {
    pendingReviews,
    rejectedChallenges,
    flaggedQuestions,
    queueCount: pendingReviews + flaggedQuestions,
    recentReviewActivity,
  };
}

export async function getModeratorActivityMetrics(): Promise<ModeratorActivityMetrics> {
  await validateAdminAccess();

  const todayStart = getStartOfDay();
  const weekStart = getStartOfWeek();

  const [challengesCreatedToday, approvalsCompleted, moderatorStats, contentStats] =
    await Promise.all([
      prisma.challenge.count({
        where: {
          createdAt: { gte: todayStart },
          createdBy: { role: { in: ["MODERATOR", "ADMIN", "SUPER_ADMIN"] } },
        },
      }),
      prisma.challenge.count({
        where: {
          status: $Enums.ChallengeStatus.LIVE,
          updatedAt: { gte: weekStart },
        },
      }),
      prisma.user.findMany({
        where: { role: { in: ["MODERATOR", "ADMIN"] } },
        select: {
          id: true,
          name: true,
          reviewedChallenges: { where: { updatedAt: { gte: weekStart } }, select: { id: true } },
          reviewedQuestions: { where: { updatedAt: { gte: weekStart } }, select: { id: true } },
          updatedAt: true,
        },
      }),
      prisma.challenge.count({
        where: {
          createdBy: { role: { in: ["MODERATOR", "ADMIN", "SUPER_ADMIN"] } },
        },
      }),
    ]);

  const questionsCreated = await prisma.question.count({
    where: {
      createdBy: { role: { in: ["MODERATOR", "ADMIN", "SUPER_ADMIN"] } },
    },
  });

  const reviewerActivity = moderatorStats.map((mod) => ({
    moderatorId: mod.id,
    moderatorName: mod.name || "Unknown",
    reviewsCompleted: mod.reviewedChallenges.length + mod.reviewedQuestions.length,
    lastActivity: mod.updatedAt,
  }));

  return {
    challengesCreatedToday,
    approvalsCompleted,
    moderationThroughput: approvalsCompleted,
    reviewerActivity,
    contentContribution: {
      totalChallengesCreated: contentStats,
      totalQuestionsCreated: questionsCreated,
    },
  };
}

export async function getUserActivityMetrics(): Promise<UserActivityMetrics> {
  await validateAdminAccess();

  const todayStart = getStartOfDay();
  const weekStart = getStartOfWeek();

  const [dailyActiveUsers, participationStats, completionStats, streakStats] = await Promise.all([
    prisma.user.count({
      where: {
        attempts: {
          some: { startedAt: { gte: todayStart } },
        },
      },
    }),
    prisma.attempt.groupBy({
      by: ["challengeId"],
      where: { startedAt: { gte: weekStart } },
      _count: { id: true },
    }),
    prisma.attempt.groupBy({
      by: ["challengeId"],
      where: { submittedAt: { gte: weekStart } },
      _count: { id: true },
    }),
    prisma.attempt.groupBy({
      by: ["userId"],
      where: {
        submittedAt: null,
        startedAt: { gte: weekStart },
      },
      _count: { id: true },
    }),
  ]);

  const totalStarted = participationStats.reduce((sum, p) => sum + p._count.id, 0);
  const totalCompleted = completionStats.reduce((sum, p) => sum + p._count.id, 0);
  const completionRate = totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0;
  const dropOffCount = streakStats.reduce((sum, s) => sum + s._count.id, 0);

  return {
    dailyActiveUsers,
    challengeParticipation: participationStats.length,
    completionRate: Math.round(completionRate * 10) / 10,
    dropOffIndicators: {
      startedNotCompleted: dropOffCount,
      averageDropOffPoint: 0,
    },
    streakActivity: {
      activeStreaks: 0,
      longestStreak: 0,
    },
  };
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  await validateAdminAccess();

  const alerts: SystemAlert[] = [];
  const weekStart = getStartOfWeek();

  const [failedSchedules, rejectedCount, publishedStats, inactiveModerators] = await Promise.all([
    prisma.challenge.count({
      where: {
        status: $Enums.ChallengeStatus.SCHEDULED,
        startsAt: { lt: new Date() },
      },
    }),
    prisma.challenge.count({
      where: {
        status: "DRAFT",
        updatedAt: { gte: weekStart },
      },
    }),
    prisma.challenge.count({
      where: {
        status: $Enums.ChallengeStatus.LIVE,
        updatedAt: { gte: weekStart },
      },
    }),
    prisma.user.findMany({
      where: {
        role: "MODERATOR",
        updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { id: true, name: true },
    }),
  ]);

  if (failedSchedules > 0) {
    alerts.push({
      id: "failed-schedule",
      type: "critical",
      title: "Failed Scheduling Jobs",
      message: `${failedSchedules} challenge(s) scheduled for past times`,
      timestamp: new Date(),
      actionUrl: "/dashboard/admin/challenges?filter=scheduled",
    });
  }

  const totalReviewed = rejectedCount + publishedStats;
  if (totalReviewed > 0 && rejectedCount / totalReviewed > 0.5) {
    alerts.push({
      id: "high-rejection",
      type: "warning",
      title: "High Rejection Rate",
      message: `${Math.round((rejectedCount / totalReviewed) * 100)}% rejection rate this week`,
      timestamp: new Date(),
      actionUrl: "/dashboard/admin/moderation",
    });
  }

  if (inactiveModerators.length > 0) {
    alerts.push({
      id: "inactive-moderators",
      type: "warning",
      title: "Inactive Moderators",
      message: `${inactiveModerators.length} moderator(s) not active in 7+ days`,
      timestamp: new Date(),
      actionUrl: "/dashboard/admin/moderators",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "system-ok",
      type: "info",
      title: "System Operational",
      message: "All platform systems running normally",
      timestamp: new Date(),
    });
  }

  return alerts;
}

export async function getRecentActivity(): Promise<
  Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    user: string | null;
  }>
> {
  await validateAdminAccess();

  const recentChallenges = await prisma.challenge.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      createdBy: { select: { name: true } },
    },
  });

  return recentChallenges.map((c) => ({
    id: c.id,
    type: "challenge",
    message: `${c.title} - ${c.status.toLowerCase()}`,
    timestamp: c.createdAt,
    user: c.createdBy?.name ?? null,
  }));
}

export async function getEngagementTrends(
  days: number = 7
): Promise<Array<{ date: string; attempts: number; uniqueUsers: number }>> {
  await validateAdminAccess();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const attempts = await prisma.attempt.groupBy({
    by: ["startedAt"],
    where: { startedAt: { gte: startDate } },
    _count: { id: true },
  });

  const userCounts = await prisma.attempt.groupBy({
    by: ["startedAt"],
    where: { startedAt: { gte: startDate } },
    _count: { userId: true },
  });

  const dateMap = new Map<string, { attempts: number; uniqueUsers: number }>();

  for (const attempt of attempts) {
    const dateKey = attempt.startedAt.toISOString().split("T")[0];
    const existing = dateMap.get(dateKey) || { attempts: 0, uniqueUsers: 0 };
    existing.attempts += attempt._count.id;
    dateMap.set(dateKey, existing);
  }

  for (const userCount of userCounts) {
    const dateKey = userCount.startedAt.toISOString().split("T")[0];
    const existing = dateMap.get(dateKey);
    if (existing) {
      existing.uniqueUsers = userCount._count.userId;
    }
  }

  const trends = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      attempts: data.attempts,
      uniqueUsers: data.uniqueUsers,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return trends;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await validateAdminAccess();

  const [
    platformHealth,
    moderationQueue,
    moderatorActivity,
    userActivity,
    alerts,
    recentActivity,
    engagementTrends,
  ] = await Promise.all([
    getPlatformHealthMetrics(),
    getModerationQueueMetrics(),
    getModeratorActivityMetrics(),
    getUserActivityMetrics(),
    getSystemAlerts(),
    getRecentActivity(),
    getEngagementTrends(7),
  ]);

  return {
    platformHealth,
    moderationQueue,
    moderatorActivity,
    userActivity,
    alerts,
    recentActivity,
    engagementTrends,
  };
}
