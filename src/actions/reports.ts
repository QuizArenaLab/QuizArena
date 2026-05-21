"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, assertAuth } from "@/lib/rbac/guards";
import type {
  ReportData,
  ReportsDashboardData,
  ReportsSummary,
  ModerationActionRecord,
  AbuseTrendPoint,
  SuspiciousActivitySignal,
  ReportFilters,
  ActionResult,
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

  const [
    summary,
    recentReports,
    highPriorityReports,
    recentModActions,
    abuseTrends,
    suspiciousActivity,
  ] = await Promise.all([
    computeReportsSummary(),
    getRecentReports(),
    getHighPriorityReports(),
    getRecentModerationActions(),
    computeAbuseTrends(),
    detectSuspiciousActivity(),
  ]);

  return {
    summary,
    recentReports,
    highPriorityReports,
    recentModActions,
    abuseTrends,
    suspiciousActivity,
  };
}

// ─── SUMMARY METRICS ──────────────────────────────────────────

async function computeReportsSummary(): Promise<ReportsSummary> {
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

  // Calculate average resolution time in hours
  let averageResolutionHours = 0;
  if (resolvedReports.length > 0) {
    const totalHours = resolvedReports.reduce((sum, r) => {
      if (!r.reviewedAt) return sum;
      return sum + (r.reviewedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60);
    }, 0);
    averageResolutionHours = Math.round((totalHours / resolvedReports.length) * 10) / 10;
  }

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
  };
}

// ─── RECENT REPORTS ──────────────────────────────────────────

async function getRecentReports(): Promise<ReportData[]> {
  const reports = await prisma.report.findMany({
    select: reportSelectClause,
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return serializeReports(reports as unknown as Record<string, unknown>[]);
}

// ─── HIGH PRIORITY REPORTS ───────────────────────────────────

async function getHighPriorityReports(): Promise<ReportData[]> {
  const reports = await prisma.report.findMany({
    where: {
      priority: { in: ["HIGH", "CRITICAL"] },
      status: { in: ["OPEN", "UNDER_REVIEW"] },
    },
    select: reportSelectClause,
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    take: 20,
  });
  return serializeReports(reports as unknown as Record<string, unknown>[]);
}

// ─── RECENT MODERATION ACTIONS ───────────────────────────────

async function getRecentModerationActions(): Promise<ModerationActionRecord[]> {
  const recent = await prisma.report.findMany({
    where: {
      status: { in: ["RESOLVED", "DISMISSED"] },
      reviewedAt: { not: null },
    },
    select: {
      id: true,
      status: true,
      type: true,
      reason: true,
      resolutionNotes: true,
      reviewedAt: true,
      reviewedBy: { select: { name: true } },
    },
    orderBy: { reviewedAt: "desc" },
    take: 15,
  });

  return recent.map((r) => ({
    id: `mod-${r.id}`,
    action: r.status === "RESOLVED" ? "Report Resolved" : "Report Dismissed",
    description: r.resolutionNotes || `${r.type.replace(/_/g, " ")} report: ${r.reason}`,
    performedBy: r.reviewedBy?.name || "System",
    timestamp: r.reviewedAt?.toISOString() || new Date().toISOString(),
    reportId: r.id,
  }));
}

// ─── ABUSE TRENDS ─────────────────────────────────────────────

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

// ─── SUSPICIOUS ACTIVITY DETECTION ────────────────────────────

async function detectSuspiciousActivity(): Promise<SuspiciousActivitySignal[]> {
  const signals: SuspiciousActivitySignal[] = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Find users with multiple reports against them
  const repeatedTargets = await prisma.report.groupBy({
    by: ["targetUserId"],
    where: {
      targetUserId: { not: null },
      createdAt: { gte: twentyFourHoursAgo },
    },
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
      title: "Repeated Reports Against User",
      description: `User "${user?.name || "Unknown"}" has ${target._count.id} reports in 24 hours`,
      severity: target._count.id > 5 ? "CRITICAL" : "HIGH",
      timestamp: now.toISOString(),
      relatedEntityId: target.targetUserId,
      relatedEntityType: "user",
    });
  }

  // Find flagged users with active reports
  const flaggedUsersWithReports = await prisma.user.findMany({
    where: {
      flagged: true,
      targetedReports: { some: { status: { in: ["OPEN", "UNDER_REVIEW"] } } },
    },
    select: { id: true, name: true },
    take: 10,
  });

  for (const user of flaggedUsersWithReports) {
    signals.push({
      id: `suspicious-flagged-${user.id}`,
      type: "flagged_user",
      title: "Flagged User With Active Reports",
      description: `Flagged user "${user.name || "Unknown"}" has unresolved reports`,
      severity: "MEDIUM",
      timestamp: now.toISOString(),
      relatedEntityId: user.id,
      relatedEntityType: "user",
    });
  }

  // Detect rapid report submissions (possible spam reporting)
  const rapidReporters = await prisma.report.groupBy({
    by: ["reportedById"],
    where: { createdAt: { gte: twentyFourHoursAgo } },
    _count: { id: true },
    having: { id: { _count: { gt: 5 } } },
  });

  for (const reporter of rapidReporters) {
    const user = await prisma.user.findUnique({
      where: { id: reporter.reportedById },
      select: { name: true },
    });
    signals.push({
      id: `suspicious-rapid-${reporter.reportedById}`,
      type: "rapid_submissions",
      title: "Rapid Report Submissions",
      description: `User "${user?.name || "Unknown"}" submitted ${reporter._count.id} reports in 24 hours`,
      severity: reporter._count.id > 10 ? "HIGH" : "MEDIUM",
      timestamp: now.toISOString(),
      relatedEntityId: reporter.reportedById,
      relatedEntityType: "user",
    });
  }

  return signals.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// ─── FILTERED REPORTS LIST ────────────────────────────────────

export async function getFilteredReports(filters: ReportFilters): Promise<ReportData[]> {
  await requireAdmin("/dashboard");

  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.type) where.type = filters.type;
  if (filters.reviewerId) where.reviewedById = filters.reviewerId;

  if (filters.search) {
    where.OR = [
      { reason: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { reportedBy: { name: { contains: filters.search, mode: "insensitive" } } },
      { reportedBy: { email: { contains: filters.search, mode: "insensitive" } } },
      { targetUser: { name: { contains: filters.search, mode: "insensitive" } } },
      { targetUser: { email: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const reports = await prisma.report.findMany({
    where,
    select: reportSelectClause,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return serializeReports(reports as unknown as Record<string, unknown>[]);
}

// ─── SINGLE REPORT ────────────────────────────────────────────

export async function getReportById(reportId: string): Promise<ReportData | null> {
  await requireAdmin("/dashboard");

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: reportSelectClause,
  });

  if (!report) return null;
  return serializeReport(report as unknown as Record<string, unknown>);
}

// ─── REPORT SUBMISSION (user-facing) ──────────────────────────

export async function submitReport(input: {
  type: string;
  reason: string;
  description?: string;
  targetUserId?: string;
  targetChallengeId?: string;
  targetQuestionId?: string;
}): Promise<ActionResult> {
  const user = await assertAuth();
  if (!user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Validate type
  const validTypes = [
    "USER_ABUSE",
    "CHEATING",
    "SPAM",
    "INAPPROPRIATE_CONTENT",
    "CHALLENGE_ISSUE",
    "QUESTION_ERROR",
    "OTHER",
  ];
  if (!validTypes.includes(input.type)) {
    return { success: false, message: "Invalid report type" };
  }

  if (!input.reason || input.reason.trim().length < 3) {
    return { success: false, message: "Please provide a valid reason" };
  }

  // Auto-classify priority based on type
  let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  if (input.type === "CHEATING") priority = "HIGH";
  else if (input.type === "USER_ABUSE") priority = "HIGH";
  else if (input.type === "QUESTION_ERROR") priority = "LOW";
  else if (input.type === "CHALLENGE_ISSUE") priority = "LOW";

  try {
    const report = await prisma.report.create({
      data: {
        type: input.type as
          | "USER_ABUSE"
          | "CHEATING"
          | "SPAM"
          | "INAPPROPRIATE_CONTENT"
          | "CHALLENGE_ISSUE"
          | "QUESTION_ERROR"
          | "OTHER",
        reason: input.reason.trim(),
        description: input.description?.trim() || null,
        priority,
        reportedById: user.id,
        targetUserId: input.targetUserId || null,
        targetChallengeId: input.targetChallengeId || null,
        targetQuestionId: input.targetQuestionId || null,
      },
    });

    return { success: true, message: "Report submitted successfully", reportId: report.id };
  } catch {
    return { success: false, message: "Failed to submit report" };
  }
}

// ─── MODERATION ACTIONS ──────────────────────────────────────

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

export async function resolveReport(
  reportId: string,
  resolutionNotes: string
): Promise<ActionResult> {
  const user = await requireAdmin("/dashboard");
  if (!user?.id) return { success: false, message: "Authentication required" };

  if (!resolutionNotes || resolutionNotes.trim().length < 3) {
    return { success: false, message: "Resolution notes are required" };
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "RESOLVED",
        reviewedById: user.id,
        reviewedAt: new Date(),
        resolutionNotes: resolutionNotes.trim(),
      },
    });
    return { success: true, message: "Report resolved successfully" };
  } catch {
    return { success: false, message: "Failed to resolve report" };
  }
}

export async function dismissReport(reportId: string, reason: string): Promise<ActionResult> {
  const user = await requireAdmin("/dashboard");
  if (!user?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "DISMISSED",
        reviewedById: user.id,
        reviewedAt: new Date(),
        resolutionNotes: reason?.trim() || "Dismissed without notes",
      },
    });
    return { success: true, message: "Report dismissed" };
  } catch {
    return { success: false, message: "Failed to dismiss report" };
  }
}

export async function suspendReportedUser(reportId: string, userId: string): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { accountState: "SUSPENDED" },
      }),
      prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          resolutionNotes: "User suspended as a result of investigation.",
        },
      }),
      prisma.reportNote.create({
        data: {
          reportId,
          authorId: admin.id,
          content: `User account suspended by ${admin.name || admin.id}`,
          isInternal: true,
        },
      }),
    ]);
    return { success: true, message: "User suspended and report resolved" };
  } catch {
    return { success: false, message: "Failed to suspend user" };
  }
}

export async function flagReportedUser(reportId: string, userId: string): Promise<ActionResult> {
  const admin = await requireAdmin("/dashboard");
  if (!admin?.id) return { success: false, message: "Authentication required" };

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { flagged: true },
      }),
      prisma.reportNote.create({
        data: {
          reportId,
          authorId: admin.id,
          content: `User flagged for monitoring by ${admin.name || admin.id}`,
          isInternal: true,
        },
      }),
    ]);
    return { success: true, message: "User flagged for monitoring" };
  } catch {
    return { success: false, message: "Failed to flag user" };
  }
}

// ─── INTERNAL NOTES ──────────────────────────────────────────

export async function addReportNote(reportId: string, content: string): Promise<ActionResult> {
  const user = await requireAdmin("/dashboard");
  if (!user?.id) return { success: false, message: "Authentication required" };

  if (!content || content.trim().length < 2) {
    return { success: false, message: "Note content is required" };
  }

  try {
    await prisma.reportNote.create({
      data: {
        reportId,
        authorId: user.id,
        content: content.trim(),
        isInternal: true,
      },
    });
    return { success: true, message: "Note added" };
  } catch {
    return { success: false, message: "Failed to add note" };
  }
}

// ─── UPDATE PRIORITY ──────────────────────────────────────────

export async function updateReportPriority(
  reportId: string,
  priority: string
): Promise<ActionResult> {
  await requireAdmin("/dashboard");

  const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  if (!validPriorities.includes(priority)) {
    return { success: false, message: "Invalid priority level" };
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { priority: priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" },
    });
    return { success: true, message: "Priority updated" };
  } catch {
    return { success: false, message: "Failed to update priority" };
  }
}
