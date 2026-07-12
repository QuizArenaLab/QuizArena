// @ts-nocheck
"use server";

/**
 * QuizArena — Question Bank Dashboard Data Service
 *
 * Server-side queries for the Question Bank Overview page.
 * All functions require admin-level authentication.
 */

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";

// ─── Auth Helper ────────────────────────────────────────────────────────────

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }
  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.ADMIN)) {
    throw new Error("Forbidden: Admin access required");
  }
  return { session, userRole };
}

// ─── KPI Overview ───────────────────────────────────────────────────────────

export interface QuestionBankOverview {
  totalQuestions: number;
  draftQuestions: number;
  pendingReview: number;
  publishedQuestions: number;
  archivedQuestions: number;
  failedImports: number;
}

export async function getQuestionBankOverview(): Promise<QuestionBankOverview> {
  try {
    await requireAdminSession();

    const [
      totalQuestions,
      draftQuestions,
      pendingReview,
      publishedQuestions,
      archivedQuestions,
      failedImports,
    ] = await Promise.all([
      prisma.question.count(),
      prisma.question.count({ where: { status: "DRAFT" } }),
      prisma.question.count({ where: { status: "REVIEW" } }),
      prisma.question.count({ where: { status: "APPROVED" } }),
      prisma.question.count({ where: { status: "ARCHIVED" } }),
      prisma.questionImportJob.count({ where: { status: "FAILED" } }),
    ]);

    return {
      totalQuestions,
      draftQuestions,
      pendingReview,
      publishedQuestions,
      archivedQuestions,
      failedImports,
    };
  } catch {
    return {
      totalQuestions: 0,
      draftQuestions: 0,
      pendingReview: 0,
      publishedQuestions: 0,
      archivedQuestions: 0,
      failedImports: 0,
    };
  }
}

// ─── Governance Overview ──────────────────────────────────────────────────────

export interface GovernanceOverview {
  healthy: number;
  monitoring: number;
  flagged: number;
  refreshRequired: number;
  retirementCandidates: number;
  insufficientData: number;
}

export async function getGovernanceOverview(): Promise<GovernanceOverview> {
  try {
    await requireAdminSession();
    const [healthy, monitoring, flagged, refreshRequired, retirementCandidates, insufficientData] =
      await Promise.all([
        prisma.question.count({ where: { lifecycleState: "HEALTHY" } }),
        prisma.question.count({ where: { lifecycleState: "MONITORING" } }),
        prisma.question.count({ where: { lifecycleState: "FLAGGED" } }),
        prisma.question.count({ where: { lifecycleState: "REFRESH_REQUIRED" } }),
        prisma.question.count({ where: { lifecycleState: "RETIREMENT_CANDIDATE" } }),
        prisma.question.count({ where: { lifecycleState: "INSUFFICIENT_DATA" } }),
      ]);

    return {
      healthy,
      monitoring,
      flagged,
      refreshRequired,
      retirementCandidates,
      insufficientData,
    };
  } catch {
    return {
      healthy: 0,
      monitoring: 0,
      flagged: 0,
      refreshRequired: 0,
      retirementCandidates: 0,
      insufficientData: 0,
    };
  }
}

// ─── Content Health Center ────────────────────────────────────────────────────

export interface ContentHealthMetrics {
  missingExplanations: number;
  missingTags: number;
  missingTopicMapping: number;
  duplicateCandidates: number;
  pendingReview: number;
  averageHealthScore: number;
  lowHealthQuestions: number;
  excellentQuestions: number;
}

export async function getContentHealthMetrics(): Promise<ContentHealthMetrics> {
  try {
    await requireAdminSession();

    const [
      missingExplanations,
      missingTags,
      missingTopicMapping,
      pendingReview,
      lowHealthQuestions,
      excellentQuestions,
      healthAgg,
    ] = await Promise.all([
      prisma.question.count({
        where: { OR: [{ explanation: null }, { explanation: "" }] },
      }),
      prisma.question
        .count({
          where: { tags: { isEmpty: true } },
        })
        .catch(() => prisma.question.count({ where: { tags: { equals: [] } } })),
      prisma.question.count({
        where: { OR: [{ topic: null }, { topic: "" }] },
      }),
      prisma.question.count({ where: { status: "REVIEW" } }),
      prisma.question.count({ where: { healthScore: { lt: 75 } } }),
      prisma.question.count({ where: { healthScore: { gte: 90 } } }),
      prisma.question.aggregate({ _avg: { healthScore: true } }),
    ]);

    return {
      missingExplanations,
      missingTags,
      missingTopicMapping,
      duplicateCandidates: 0, // Mocked for now; complex real-time computation
      pendingReview,
      averageHealthScore: Math.round(healthAgg._avg.healthScore || 0),
      lowHealthQuestions,
      excellentQuestions,
    };
  } catch {
    return {
      missingExplanations: 0,
      missingTags: 0,
      missingTopicMapping: 0,
      duplicateCandidates: 0,
      pendingReview: 0,
      averageHealthScore: 0,
      lowHealthQuestions: 0,
      excellentQuestions: 0,
    };
  }
}

// ─── Review Queue Snapshot ──────────────────────────────────────────────────

export interface ReviewSnapshot {
  draftQuestions: number;
  pendingReview: number;
  approvedToday: number;
  rejectedToday: number;
}

export async function getReviewQueueSnapshot(): Promise<ReviewSnapshot> {
  try {
    await requireAdminSession();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [draftQuestions, pendingReview, approvedToday, rejectedToday] = await Promise.all([
      prisma.question.count({ where: { status: "DRAFT" } }),
      prisma.question.count({ where: { status: "REVIEW" } }),
      prisma.question.count({
        where: { status: "APPROVED", reviewedAt: { gte: today } },
      }),
      prisma.question.count({
        where: { status: "REJECTED", reviewedAt: { gte: today } },
      }),
    ]);

    return { draftQuestions, pendingReview, approvedToday, rejectedToday };
  } catch {
    return { draftQuestions: 0, pendingReview: 0, approvedToday: 0, rejectedToday: 0 };
  }
}

// ─── Recent Publishing Activity ─────────────────────────────────────────────

export interface PublishingActivityItem {
  id: string;
  questionCode: string | null;
  question: string;
  publishedAt: Date;
  publisherName: string | null;
}

export async function getRecentPublishingActivity(limit = 5): Promise<PublishingActivityItem[]> {
  try {
    await requireAdminSession();

    const recent = await prisma.question.findMany({
      where: { status: "APPROVED", reviewedAt: { not: null } },
      orderBy: { reviewedAt: "desc" },
      take: limit,
      select: {
        id: true,
        questionCode: true,
        question: true,
        reviewedAt: true,
        approvedBy: { select: { name: true } },
      },
    });

    return recent.map((r) => ({
      id: r.id,
      questionCode: r.questionCode,
      question: r.question,
      publishedAt: r.reviewedAt!,
      publisherName: r.approvedBy?.name ?? "System",
    }));
  } catch {
    return [];
  }
}

// ─── Import Pipeline Status ─────────────────────────────────────────────────

export interface PipelineStatus {
  lastJobId: string | null;
  fileName: string | null;
  importedCount: number;
  failedCount: number;
  status: string | null;
  createdAt: Date | null;
  totalFailedImports: number;
}

export async function getImportPipelineStatus(): Promise<PipelineStatus> {
  try {
    await requireAdminSession();

    const [lastJob, totalFailed] = await Promise.all([
      prisma.questionImportJob.findFirst({
        orderBy: { createdAt: "desc" },
      }),
      prisma.questionImportJob.count({ where: { status: "FAILED" } }),
    ]);

    if (!lastJob) {
      return {
        lastJobId: null,
        fileName: null,
        importedCount: 0,
        failedCount: 0,
        status: null,
        createdAt: null,
        totalFailedImports: totalFailed,
      };
    }

    return {
      lastJobId: lastJob.id,
      fileName: lastJob.fileName,
      importedCount: lastJob.validRows ?? 0,
      failedCount: lastJob.invalidRows ?? 0,
      status: lastJob.status,
      createdAt: lastJob.createdAt,
      totalFailedImports: totalFailed,
    };
  } catch {
    return {
      lastJobId: null,
      fileName: null,
      importedCount: 0,
      failedCount: 0,
      status: null,
      createdAt: null,
      totalFailedImports: 0,
    };
  }
}

// ─── Original Health Breakdown ────────────────────────────────────────────────

export interface QuestionBankHealth {
  byExam: { exam: string; count: number }[];
  byDifficulty: { difficulty: string; count: number }[];
  missingExplanation: number;
  unusedQuestions: number;
  pendingReview: number;
  averageHealthScore: number;
  lowHealthQuestions: number;
  excellentQuestions: number;
}

export async function getQuestionHealthBreakdown(): Promise<QuestionBankHealth> {
  try {
    await requireAdminSession();

    const [
      byExamRaw,
      byDiffRaw,
      missingExplanation,
      unusedQuestions,
      pendingReview,
      healthAgg,
      lowHealth,
      excellentHealth,
    ] = await Promise.all([
      prisma.question.groupBy({ by: ["examCategory"], _count: true }),
      prisma.question.groupBy({ by: ["difficulty"], _count: true }),
      prisma.question.count({ where: { OR: [{ explanation: null }, { explanation: "" }] } }),
      prisma.question.count({ where: { usageCount: 0 } }),
      prisma.question.count({ where: { status: "REVIEW" } }),
      prisma.question.aggregate({ _avg: { healthScore: true } }),
      prisma.question.count({ where: { healthScore: { lt: 75 } } }),
      prisma.question.count({ where: { healthScore: { gte: 90 } } }),
    ]);

    return {
      byExam: byExamRaw
        .filter((r) => r.examCategory)
        .map((r) => ({ exam: r.examCategory!, count: r._count })),
      byDifficulty: byDiffRaw.map((r) => ({ difficulty: r.difficulty, count: r._count })),
      missingExplanation,
      unusedQuestions,
      pendingReview,
      averageHealthScore: Math.round(healthAgg._avg.healthScore || 0),
      lowHealthQuestions: lowHealth,
      excellentQuestions: excellentHealth,
    };
  } catch {
    return {
      byExam: [],
      byDifficulty: [],
      missingExplanation: 0,
      unusedQuestions: 0,
      pendingReview: 0,
      averageHealthScore: 0,
      lowHealthQuestions: 0,
      excellentQuestions: 0,
    };
  }
}

// ─── Original Recent Activity ──────────────────────────────────────────────────

export interface RecentActivityItem {
  id: string;
  action: string;
  questionId: string;
  questionCode: string | null;
  actorName: string | null;
  createdAt: Date;
}

export async function getRecentQuestionActivity(limit = 7): Promise<RecentActivityItem[]> {
  try {
    await requireAdminSession();

    const logs = await prisma.questionAuditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { name: true } },
        question: { select: { questionCode: true } },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      questionId: log.questionId,
      questionCode: log.question.questionCode,
      actorName: log.actor.name,
      createdAt: log.createdAt,
    }));
  } catch {
    return [];
  }
}
