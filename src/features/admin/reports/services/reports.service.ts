"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, assertAuth } from "@/features/rbac/services/guards";
import type {
  ReportData,
  ReportsDashboardData,
  ReportsSummary,
  ModerationActionRecord,
  AbuseTrendPoint,
  SuspiciousActivitySignal,
  ReportFilters,
  ActionResult,
  AbuseIntelligence,
} from "@/types/reports";

// ─── REPORT SELECT CLAUSE ────────────────────────────────────

const reportSelectClause = {
  id: true,
  type: true,
  reason: true,
  description: true,
  status: true,
  priority: true,
  reportedBy: {
    select: { id: true, name: true, email: true, image: true },
  },
  targetUser: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      accountState: true,
      flagged: true,
    },
  },
  targetChallenge: {
    select: { id: true, title: true, status: true },
  },
  targetQuestion: {
    select: { id: true, question: true, status: true },
  },
  reviewedBy: {
    select: { id: true, name: true },
  },
  reviewedAt: true,
  resolutionNotes: true,
  notes: {
    select: {
      id: true,
      content: true,
      isInternal: true,
      createdAt: true,
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" as const },
  },
  createdAt: true,
  updatedAt: true,
} as const;

function serializeReport(report: Record<string, unknown>): ReportData {
  return JSON.parse(JSON.stringify(report)) as ReportData;
}

function serializeReports(reports: Record<string, unknown>[]): ReportData[] {
  return JSON.parse(JSON.stringify(reports)) as ReportData[];
}

// ─── DASHBOARD DATA ──────────────────────────────────────────

export async function getReportsDashboardData(): Promise<ReportsDashboardData> {
  await requireAdmin("/dashboard");

  // Execute concurrently but without the legacy, unused abuseTrends and suspiciousActivity
  // functions that were generating 50+ N+1 queries.
  const [
    summary,
    statusCounts,
    agingMetrics,
    platformHealth,
    recentReports,
    highPriorityReports,
    recentModActions,
    abuseIntelligence,
  ] = await Promise.all([
    fetchReportOverview(),
    fetchStatusCounts(),
    fetchAgingMetrics(),
    fetchPlatformHealth(),
    fetchModerationQueue({}), // initial fetch without pagination
    getHighPriorityReports(),
    fetchModerationActivity(1, 10), // first page for dashboard
    fetchAbuseIntelligence(),
  ]);

  return {
    summary,
    statusCounts,
    agingMetrics,
    platformHealth,
    recentReports,
    highPriorityReports,
    recentModActions,
    abuseTrends: [], // Deprecated
    suspiciousActivity: [], // Deprecated
    abuseIntelligence,
  };
}

// ─── KPI OVERVIEW & METRICS ───────────────────────────────────

export async function fetchStatusCounts() {
  const [OPEN, UNDER_REVIEW, CRITICAL, RESOLVED, DISMISSED] = await Promise.all([
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.report.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.report.count({
      where: { priority: "CRITICAL", status: { in: ["OPEN", "UNDER_REVIEW"] } },
    }),
    prisma.report.count({ where: { status: "RESOLVED" } }),
    prisma.report.count({ where: { status: "DISMISSED" } }),
  ]);
  return { OPEN, UNDER_REVIEW, CRITICAL, RESOLVED, DISMISSED };
}

export async function fetchAgingMetrics() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const [under24h, between24hAnd48h, over48h] = await Promise.all([
    prisma.report.count({
      where: {
        status: { in: ["OPEN", "UNDER_REVIEW"] },
        createdAt: { gte: twentyFourHoursAgo },
      },
    }),
    prisma.report.count({
      where: {
        status: { in: ["OPEN", "UNDER_REVIEW"] },
        createdAt: { gte: fortyEightHoursAgo, lt: twentyFourHoursAgo },
      },
    }),
    prisma.report.count({
      where: {
        status: { in: ["OPEN", "UNDER_REVIEW"] },
        createdAt: { lt: fortyEightHoursAgo },
      },
    }),
  ]);

  return { under24h, between24hAnd48h, over48h };
}

export async function fetchPlatformHealth() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [reportsMonitoredToday, competitionsMonitored, usersMonitored, lastResolvedAudit] =
    await Promise.all([
      prisma.report.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.challenge.count(),
      prisma.user.count(),
      prisma.auditLog.findFirst({
        where: {
          action: { in: ["REPORT_RESOLVED", "REPORT_DISMISSED"] },
          entityType: "MODERATION",
        },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

  return {
    reportsMonitoredToday,
    competitionsMonitored,
    usersMonitored,
    lastResolvedIncident: lastResolvedAudit ? lastResolvedAudit.createdAt.toISOString() : null,
  };
}

export async function fetchReportOverview(): Promise<ReportsSummary> {
  await requireAdmin("/dashboard");

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalOpen,
    totalUnderReview,
    totalResolved,
    totalDismissed,
    totalCritical,
    totalHigh,
    totalReportsToday,
    totalReportsWeek,
    resolvedReports,
  ] = await Promise.all([
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.report.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.report.count({ where: { status: "RESOLVED" } }),
    prisma.report.count({ where: { status: "DISMISSED" } }),
    prisma.report.count({
      where: { priority: "CRITICAL", status: { in: ["OPEN", "UNDER_REVIEW"] } },
    }),
    prisma.report.count({ where: { priority: "HIGH", status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
    prisma.report.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.report.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.report.findMany({
      where: { status: "RESOLVED", reviewedAt: { not: null } },
      select: { createdAt: true, reviewedAt: true },
      take: 100,
      orderBy: { reviewedAt: "desc" },
    }),
  ]);

  let averageResolutionHours = 0;
  if (resolvedReports.length > 0) {
    const totalHours = resolvedReports.reduce((sum, r) => {
      if (!r.reviewedAt) return sum;
      return sum + (r.reviewedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60);
    }, 0);
    averageResolutionHours = Math.round((totalHours / resolvedReports.length) * 10) / 10;
  }

  // False report rate calculation
  const totalActioned = totalResolved + totalDismissed;
  const falseReportRate =
    totalActioned > 0 ? Math.round((totalDismissed / totalActioned) * 100) : 0;

  return {
    totalOpen,
    totalUnderReview,
    totalResolved,
    totalDismissed,
    totalCritical,
    totalHigh,
    totalReportsToday,
    totalReportsWeek,
    averageResolutionHours,
    falseReportRate,
  };
}

// ─── LIVE MODERATION QUEUE ────────────────────────────────────

export async function fetchModerationQueue(
  filters: ReportFilters,
  page: number = 1,
  limit: number = 50
): Promise<ReportData[]> {
  await requireAdmin("/dashboard");

  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.type) where.type = filters.type;

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: "insensitive" } },
      { reason: { contains: filters.search, mode: "insensitive" } },
      { reportedBy: { name: { contains: filters.search, mode: "insensitive" } } },
      { reportedBy: { email: { contains: filters.search, mode: "insensitive" } } },
      { reportedBy: { username: { contains: filters.search, mode: "insensitive" } } },
      { targetUser: { name: { contains: filters.search, mode: "insensitive" } } },
      { targetUser: { username: { contains: filters.search, mode: "insensitive" } } },
      { targetChallenge: { title: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const reports = await prisma.report.findMany({
    where,
    select: reportSelectClause,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    skip: (page - 1) * limit,
    take: limit,
  });

  return serializeReports(reports as unknown as Record<string, unknown>[]);
}

export async function getHighPriorityReports(): Promise<ReportData[]> {
  const reports = await prisma.report.findMany({
    where: {
      priority: { in: ["HIGH", "CRITICAL"] },
      status: { in: ["OPEN", "UNDER_REVIEW"] },
    },
    select: reportSelectClause,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 20,
  });
  return serializeReports(reports as unknown as Record<string, unknown>[]);
}

export async function fetchReportDetails(reportId: string): Promise<ReportData | null> {
  await requireAdmin("/dashboard");
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: reportSelectClause,
  });
  if (!report) return null;
  return serializeReport(report as unknown as Record<string, unknown>);
}

// ─── ABUSE INTELLIGENCE ───────────────────────────────────────

export async function fetchAbuseIntelligence(): Promise<AbuseIntelligence> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Top users reported
  const topUsersGroups = await prisma.report.groupBy({
    by: ["targetUserId"],
    where: { targetUserId: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const topUsers = await Promise.all(
    topUsersGroups.map(async (u) => {
      const user = await prisma.user.findUnique({
        where: { id: u.targetUserId! },
        select: { name: true },
      });
      return { id: u.targetUserId!, name: user?.name || "Unknown", reportCount: u._count.id };
    })
  );

  // Top competitions reported
  const topCompsGroups = await prisma.report.groupBy({
    by: ["targetChallengeId"],
    where: { targetChallengeId: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const topCompetitions = await Promise.all(
    topCompsGroups.map(async (c) => {
      const comp = await prisma.challenge.findUnique({
        where: { id: c.targetChallengeId! },
        select: { title: true },
      });
      return {
        id: c.targetChallengeId!,
        title: comp?.title || "Unknown",
        reportCount: c._count.id,
      };
    })
  );

  // Most common abuse types
  const abuseTypesGroups = await prisma.report.groupBy({
    by: ["type"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const commonAbuseTypes = abuseTypesGroups.map((t) => ({ type: t.type, count: t._count.id }));

  // Repeat Offenders
  const repeatOffendersGroups = await prisma.report.groupBy({
    by: ["targetUserId"],
    where: { targetUserId: { not: null }, createdAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
    having: { id: { _count: { gt: 3 } } },
  });

  const repeatOffendersCount = repeatOffendersGroups.length;

  return {
    topUsers,
    topCompetitions,
    commonAbuseTypes,
    repeatOffendersCount,
  };
}

// ─── MODERATION ACTIVITY LOG (AuditLog) ───────────────────────

export async function fetchModerationActivity(
  page = 1,
  limit = 20
): Promise<ModerationActionRecord[]> {
  const audits = await prisma.auditLog.findMany({
    where: { entityType: "MODERATION" },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: { actor: { select: { name: true } } },
  });

  return audits.map((a) => {
    let desc = a.action;
    if (a.metadata && typeof a.metadata === "object" && "reason" in a.metadata) {
      desc = (a.metadata as any).reason;
    }
    return {
      id: a.id,
      action: a.action,
      description: desc,
      performedBy: a.actor?.name || "System",
      timestamp: a.createdAt.toISOString(),
      reportId: a.entityId || undefined,
    };
  });
}

// ─── MODERATION WORKFLOWS ────────────────────────────────────

export async function resolveReport(
  reportId: string,
  status: "RESOLVED" | "DISMISSED",
  notes: string
): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: {
          status,
          reviewedById: admin.id,
          reviewedAt: new Date(),
          resolutionNotes: notes.trim(),
        },
      }),
      prisma.auditLog.create({
        data: {
          action: status === "RESOLVED" ? "REPORT_RESOLVED" : "REPORT_DISMISSED",
          entityType: "MODERATION",
          entityId: reportId,
          actorId: admin.id,
          metadata: { reason: notes.trim() },
        },
      }),
    ]);
    return { success: true, message: `Report ${status.toLowerCase()} successfully` };
  } catch (error) {
    return { success: false, message: "Failed to action report" };
  }
}

export async function warnUser(
  userId: string,
  reportId: string,
  warningTemplate: string
): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          resolutionNotes: `User warned: ${warningTemplate}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { flagged: true }, // Simple flagging for warning
      }),
      prisma.auditLog.create({
        data: {
          action: "USER_WARNED",
          entityType: "MODERATION",
          entityId: reportId,
          actorId: admin.id,
          targetUserId: userId,
          metadata: { reason: warningTemplate },
        },
      }),
      prisma.moderationNote.create({
        data: {
          userId,
          createdById: admin.id,
          note: `WARNING ISSUED: ${warningTemplate}`,
        },
      }),
    ]);
    return { success: true, message: "User warned successfully" };
  } catch {
    return { success: false, message: "Failed to warn user" };
  }
}

export async function restrictUser(
  userId: string,
  reportId: string,
  durationDays: number,
  reason: string
): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          resolutionNotes: `User restricted for ${durationDays} days: ${reason}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { accountState: "SUSPENDED" }, // Prisma enum doesn't have RESTRICTED for users
      }),
      prisma.auditLog.create({
        data: {
          action: "USER_RESTRICTED",
          entityType: "MODERATION",
          entityId: reportId,
          actorId: admin.id,
          targetUserId: userId,
          metadata: { reason, durationDays },
        },
      }),
      prisma.moderationNote.create({
        data: {
          userId,
          createdById: admin.id,
          note: `RESTRICTED (${durationDays} days): ${reason}`,
        },
      }),
    ]);
    return { success: true, message: "User restricted successfully" };
  } catch {
    return { success: false, message: "Failed to restrict user" };
  }
}

export async function suspendUser(
  userId: string,
  reportId: string,
  reason: string
): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          resolutionNotes: `User permanently suspended: ${reason}`,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { accountState: "BANNED" },
      }),
      prisma.auditLog.create({
        data: {
          action: "USER_SUSPENDED",
          entityType: "MODERATION",
          entityId: reportId,
          actorId: admin.id,
          targetUserId: userId,
          metadata: { reason, durationDays: -1 },
        },
      }),
      prisma.moderationNote.create({
        data: {
          userId,
          createdById: admin.id,
          note: `SUSPENDED: ${reason}`,
        },
      }),
    ]);
    return { success: true, message: "User suspended successfully" };
  } catch {
    return { success: false, message: "Failed to suspend user" };
  }
}

export async function markReportUnderReview(reportId: string): Promise<ActionResult> {
  const user = await requireAdmin("/dashboard");
  if (!user?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "UNDER_REVIEW",
        reviewedById: user.id,
      },
    });
    return { success: true, message: "Report marked as under review" };
  } catch {
    return { success: false, message: "Failed to update report status" };
  }
}

// Keep older helper functions for compatibility or Dashboard aggregation if necessary
async function computeAbuseTrends(): Promise<AbuseTrendPoint[]> {
  const now = new Date();
  const days = 14;
  const trends: AbuseTrendPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dateLabel = dayStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const [reports, resolved, critical] = await Promise.all([
      prisma.report.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
      prisma.report.count({
        where: { status: "RESOLVED", reviewedAt: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.report.count({
        where: { priority: "CRITICAL", createdAt: { gte: dayStart, lte: dayEnd } },
      }),
    ]);

    trends.push({ date: dateLabel, reports, resolved, critical });
  }

  return trends;
}

async function detectSuspiciousActivity(): Promise<SuspiciousActivitySignal[]> {
  const signals: SuspiciousActivitySignal[] = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Example subset implementation
  const repeatedTargets = await prisma.report.groupBy({
    by: ["targetUserId"],
    where: { targetUserId: { not: null }, createdAt: { gte: twentyFourHoursAgo } },
    _count: { id: true },
    having: { id: { _count: { gt: 2 } } },
  });

  for (const target of repeatedTargets) {
    if (!target.targetUserId) continue;
    const user = await prisma.user.findUnique({
      where: { id: target.targetUserId },
      select: { name: true },
    });
    signals.push({
      id: `suspicious-repeated-${target.targetUserId}`,
      type: "repeated_reports",
      title: "Repeated Reports",
      description: `User "${user?.name || "Unknown"}" has ${target._count.id} reports in 24 hours`,
      severity: target._count.id > 5 ? "CRITICAL" : "HIGH",
      timestamp: now.toISOString(),
      relatedEntityId: target.targetUserId,
      relatedEntityType: "user",
    });
  }

  return signals;
}

export async function submitReport(input: any): Promise<ActionResult> {
  // Same as old implementation for user-facing part
  // Proxy to old service or implement if needed. Left stubbed to show we can use old file.
  return { success: false, message: "Not implemented in this service yet." };
}
