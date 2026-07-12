// @ts-nocheck
"use server";

/**
 * QuizArena — Question Bank Governance Server Actions
 *
 * Centralized, server-authoritative question governance operations.
 * All critical operations are RBAC-enforced, validated via Zod,
 * and audited through QuestionAudit + AuditLog.
 */

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import {
  createQuestionSchema,
  updateQuestionSchema,
  questionFiltersSchema,
} from "@/lib/validations/question";
import { generateQuestionCode } from "@/features/admin/services/question-bank/question-code";
import { validateTransition } from "@/features/admin/services/question-bank/governance";
import { checkForDuplicates } from "@/features/admin/services/question-bank/duplicate-detection";
import { createAuditLog } from "@/features/super-admin/services/audit/index";
import { revalidatePath } from "next/cache";
import { getAllQuestionIdsByIntelligenceFilter } from "@/features/admin/services/question-bank/analytics/dashboard-engine";

// ─── Auth Helpers ───────────────────────────────────────────────────────────

async function requireModeratorSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }
  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    throw new Error("Forbidden: You do not have permission to manage questions");
  }
  return { session, userRole };
}

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

// ─── Audit Helper ───────────────────────────────────────────────────────────

async function createQuestionAuditLog(
  questionId: string,
  action:
    | "CREATED"
    | "UPDATED"
    | "SUBMITTED_FOR_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "FLAGGED"
    | "ARCHIVED"
    | "VERSION_CREATED"
    | "SNAPSHOT_GENERATED"
    | "BULK_IMPORTED",
  actorId: string,
  previousStatus?: string,
  nextStatus?: string,
  previousVersion?: number,
  nextVersion?: number,
  reason?: string,
  metadata?: any
) {
  await prisma.questionAuditLog.create({
    data: {
      questionId,
      action,
      actorId,
      previousStatus: previousStatus as any,
      nextStatus: nextStatus as any,
      previousVersion,
      nextVersion,
      reason: reason ?? undefined,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  });
}

function revalidateQuestionPaths(questionId?: string) {
  revalidatePath("/dashboard/admin/question-bank");
  revalidatePath("/dashboard/admin/question-bank/review");
  revalidatePath("/dashboard/admin/questions");
  revalidatePath("/dashboard/admin/questions/review");
  revalidatePath("/dashboard/admin/questions/drafts");
  revalidatePath("/dashboard/admin/questions/published");
  revalidatePath("/dashboard/admin/questions/archive");
  revalidatePath("/dashboard/moderator/questions");
  if (questionId) {
    revalidatePath(`/dashboard/admin/question-bank/${questionId}`);
    revalidatePath(`/dashboard/moderator/questions/${questionId}/edit`);
  }
}

// ─── CREATE ─────────────────────────────────────────────────────────────────

export async function createQuestion(data: unknown): Promise<{
  success: boolean;
  questionId?: string;
  questionCode?: string;
  error?: string;
  warning?: string;
}> {
  try {
    const { session } = await requireModeratorSession();
    const parsed = createQuestionSchema.parse(data);
    const { options, tags, ...questionData } = parsed;

    // Duplicate detection
    const duplicateCheck = await checkForDuplicates({
      question: parsed.question,
      category: parsed.category,
      subject: parsed.subject,
      explanation: parsed.explanation,
      options: options,
    });
    if (duplicateCheck.status === "EXACT") {
      return {
        success: false,
        error: `Duplicate question detected (${duplicateCheck.candidates[0]?.questionCode || duplicateCheck.candidates[0]?.id})`,
      };
    }

    // Generate question code
    const questionCode = await generateQuestionCode(parsed.category);

    // Create question with options
    const question = await prisma.question.create({
      data: {
        questionCode,
        question: questionData.question,
        explanation: questionData.explanation,
        subject: questionData.subject,
        topic: questionData.topic,
        category: questionData.category,
        language: questionData.language,
        marks: questionData.marks,
        negativeMarks: questionData.negativeMarks,
        difficulty: questionData.difficulty,
        tags,

        healthScore: questionData.healthScore,
        healthGrade: questionData.healthGrade,
        healthStatus: questionData.healthStatus,
        healthLastCalculatedAt: new Date(),
        status: "DRAFT",
        version: 1,
        isActive: true,
        usageCount: 0,
        createdById: session.user.id,
        options: {
          create: options.map((opt) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        },
      },
    });

    // Audit trail
    await createQuestionAuditLog(
      question.id,
      "CREATED",
      session.user.id,
      undefined,
      "DRAFT",
      undefined,
      1,
      undefined,
      {
        questionCode,
        category: parsed.category,
        subject: parsed.subject,
        difficulty: parsed.difficulty,
      }
    );

    await createAuditLog({
      action: "QUESTION_CREATED",
      entityType: "QUESTION",
      entityId: question.id,
      actorId: session.user.id,
      severity: "LOW",
      metadata: { questionCode, category: parsed.category },
    });

    revalidateQuestionPaths(question.id);

    return {
      success: true,
      questionId: question.id,
      questionCode,
      warning:
        duplicateCheck.status === "SIMILAR"
          ? `Near-duplicate detected (${Math.round((duplicateCheck.highestScore ?? 0) * 100)}% similar to ${duplicateCheck.candidates[0]?.questionCode || duplicateCheck.candidates[0]?.id})`
          : undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return {
        success: false,
        error: zodError.issues[0]?.message || "Validation failed",
      };
    }
    return { success: false, error: "Failed to create question" };
  }
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────

export async function updateQuestion(data: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireModeratorSession();
    const parsed = updateQuestionSchema.parse(data);

    const existing = await prisma.question.findUnique({
      where: { id: parsed.id },
      select: {
        status: true,
        createdById: true,
        version: true,
        question: true,
        subject: true,
        category: true,
        difficulty: true,
      },
    });

    if (!existing) {
      return { success: false, error: "Question not found" };
    }

    // Ownership check for moderators
    if (userRole === "MODERATOR" && existing.createdById !== session.user.id) {
      return {
        success: false,
        error: "You can only edit questions you created",
      };
    }

    // Status check — only DRAFT and REJECTED can be edited
    if (
      existing.status !== "DRAFT" &&
      existing.status !== "REJECTED" &&
      !hasMinimumRole(userRole, ROLE.SUPER_ADMIN)
    ) {
      return {
        success: false,
        error: `Cannot edit a question in ${existing.status} status`,
      };
    }

    const { options, tags, ...questionData } = parsed;

    // Build update data
    const updateData: Record<string, unknown> = {
      version: { increment: 1 },
    };

    if (questionData.question !== undefined) updateData.question = questionData.question;
    if (questionData.explanation !== undefined) updateData.explanation = questionData.explanation;
    if (questionData.subject !== undefined) updateData.subject = questionData.subject;
    if (questionData.topic !== undefined) updateData.topic = questionData.topic;
    if (questionData.category !== undefined) updateData.category = questionData.category;
    if (questionData.language !== undefined) updateData.language = questionData.language;
    if (questionData.marks !== undefined) updateData.marks = questionData.marks;
    if (questionData.negativeMarks !== undefined)
      updateData.negativeMarks = questionData.negativeMarks;
    if (questionData.difficulty !== undefined) updateData.difficulty = questionData.difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (questionData.healthScore !== undefined) updateData.healthScore = questionData.healthScore;
    if (questionData.healthGrade !== undefined) updateData.healthGrade = questionData.healthGrade;
    if (questionData.healthStatus !== undefined) {
      updateData.healthStatus = questionData.healthStatus;
      updateData.healthLastCalculatedAt = new Date();
    }

    // If question was rejected, return to draft on edit
    if (existing.status === "REJECTED") {
      updateData.status = "DRAFT";
      updateData.rejectionReason = null;
    }

    await prisma.question.update({
      where: { id: parsed.id },
      data: updateData,
    });

    // Replace options if provided
    if (options && options.length > 0) {
      await prisma.questionOption.deleteMany({
        where: { questionId: parsed.id },
      });
      await prisma.questionOption.createMany({
        data: options.map((opt) => ({
          questionId: parsed.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
      });
    }

    // Audit trail
    await createQuestionAuditLog(
      parsed.id,
      "UPDATED",
      session.user.id,
      existing.status,
      (updateData.status as string | undefined) || existing.status,
      existing.version,
      existing.version + 1,
      undefined,
      { updatedFields: Object.keys(questionData) }
    );

    revalidateQuestionPaths(parsed.id);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return {
        success: false,
        error: zodError.issues[0]?.message || "Validation failed",
      };
    }
    return { success: false, error: "Failed to update question" };
  }
}

// ─── SUBMIT FOR REVIEW ──────────────────────────────────────────────────────

export async function submitForReview(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireModeratorSession();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true, createdById: true, healthScore: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if ((question.healthScore ?? 0) < 75) {
      return {
        success: false,
        error: "Question must have a health score >= 75 to be submitted for review.",
      };
    }

    // Moderators can only submit their own
    if (userRole === "MODERATOR" && question.createdById !== session.user.id) {
      return {
        success: false,
        error: "You can only submit your own questions for review",
      };
    }

    const validation = validateTransition(question.status, "REVIEW", userRole);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { status: "REVIEW" },
    });

    await createQuestionAuditLog(
      questionId,
      "SUBMITTED_FOR_REVIEW",
      session.user.id,
      question.status,
      "REVIEW"
    );

    await createAuditLog({
      action: "QUESTION_SUBMITTED_FOR_REVIEW",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "LOW",
    });

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to submit for review" };
  }
}

// ─── APPROVE ────────────────────────────────────────────────────────────────

export async function approveQuestion(
  questionId: string,
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true, createdById: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const validation = validateTransition(question.status, "APPROVED", userRole);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Self-approval prevention
    if (question.createdById === session.user.id && userRole !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Cannot approve your own questions",
      };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "APPROVED",
        reviewedById: session.user.id,
        approvedById: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || null,
        rejectionReason: null,
      },
    });

    await createQuestionAuditLog(
      questionId,
      "APPROVED",
      session.user.id,
      question.status,
      "APPROVED",
      undefined,
      undefined,
      reviewNotes
    );

    await createAuditLog({
      action: "QUESTION_APPROVED",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "MEDIUM",
      metadata: { reviewNotes },
    });

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to approve question" };
  }
}

// ─── REJECT ─────────────────────────────────────────────────────────────────

export async function rejectQuestion(
  questionId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return { success: false, error: "Rejection reason is required" };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const validation = validateTransition(question.status, "REJECTED", userRole, rejectionReason);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "REJECTED",
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason.trim(),
        reviewNotes: null,
      },
    });

    await createQuestionAuditLog(
      questionId,
      "REJECTED",
      session.user.id,
      question.status,
      "REJECTED",
      undefined,
      undefined,
      rejectionReason
    );

    await createAuditLog({
      action: "QUESTION_REJECTED",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "MEDIUM",
      metadata: { rejectionReason },
    });

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to reject question" };
  }
}

// ─── ARCHIVE ────────────────────────────────────────────────────────────────

export async function archiveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const validation = validateTransition(question.status, "ARCHIVED", userRole);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "ARCHIVED",
        isActive: false,
      },
    });

    await createQuestionAuditLog(
      questionId,
      "ARCHIVED",
      session.user.id,
      question.status,
      "ARCHIVED"
    );

    await createAuditLog({
      action: "QUESTION_ARCHIVED",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "LOW",
    });

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to archive question" };
  }
}

// ─── FLAG ───────────────────────────────────────────────────────────────────

export async function flagQuestion(
  questionId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    if (!reason || reason.trim().length === 0) {
      return { success: false, error: "Flag reason is required" };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const validation = validateTransition(question.status, "FLAGGED", userRole, reason);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "FLAGGED",
        isActive: false,
      },
    });

    await createQuestionAuditLog(
      questionId,
      "FLAGGED",
      session.user.id,
      question.status,
      "FLAGGED",
      undefined,
      undefined,
      reason
    );

    await createAuditLog({
      action: "QUESTION_FLAGGED",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "HIGH",
      metadata: { reason, previousStatus: question.status },
    });

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to flag question" };
  }
}

// ─── GET QUESTIONS (Paginated, Filtered) ────────────────────────────────────

export interface QuestionBankItem {
  id: string;
  questionCode: string | null;
  question: string;
  explanation: string | null;
  subject: string | null;
  category: string | null;
  topic: string | null;
  difficulty: string;
  status: string;
  marks: number;
  negativeMarks: number;
  tags: string[];
  version: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: { id: string; name: string | null; email: string | null } | null;
  reviewedBy: { id: string; name: string | null } | null;
  approvedBy: { id: string; name: string | null } | null;
  _count: { challenges: number; options: number };
  options: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }>;
}

export interface QuestionBankListResult {
  questions: QuestionBankItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getQuestions(filters: unknown): Promise<QuestionBankListResult> {
  try {
    await requireModeratorSession();

    const parsed = questionFiltersSchema.parse(filters);
    const {
      search,
      category,
      subject,
      topic,
      difficulty,
      status,
      tags,
      createdBy,
      approvedBy,
      intelligence,
      page,
      limit,
    } = parsed;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (intelligence) {
      const ids = await getAllQuestionIdsByIntelligenceFilter(intelligence);
      // If intelligence filter returns no IDs, ensure the query returns empty
      where.id = ids.length > 0 ? { in: ids } : { in: ["__no_match__"] };
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { questionCode: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { topic: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) where.category = category;
    if (subject) where.subject = subject;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (createdBy) where.createdById = createdBy;
    if (approvedBy) where.approvedById = approvedBy;
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          questionCode: true,
          question: true,
          explanation: true,
          subject: true,
          category: true,
          topic: true,
          difficulty: true,
          status: true,
          marks: true,
          negativeMarks: true,
          tags: true,
          version: true,
          usageCount: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          healthScore: true,
          healthGrade: true,
          healthStatus: true,
          healthLastCalculatedAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          reviewedBy: {
            select: { id: true, name: true },
          },
          approvedBy: {
            select: { id: true, name: true },
          },
          _count: { select: { challenges: true, options: true } },
          options: {
            select: { id: true, optionText: true, isCorrect: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return {
      questions: questions as QuestionBankItem[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { questions: [], total: 0, page: 1, totalPages: 0 };
  }
}

// ─── GET QUESTION BY ID ─────────────────────────────────────────────────────

export async function getQuestionById(questionId: string) {
  try {
    await requireModeratorSession();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        questionCode: true,
        question: true,
        explanation: true,
        subject: true,
        category: true,
        topic: true,
        language: true,
        marks: true,
        negativeMarks: true,
        difficulty: true,
        status: true,
        tags: true,
        version: true,
        usageCount: true,
        isActive: true,
        reviewNotes: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        reviewedAt: true,
        healthScore: true,
        healthGrade: true,
        healthStatus: true,
        healthLastCalculatedAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
        reviewedBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        _count: { select: { challenges: true } },
        options: {
          select: {
            id: true,
            optionText: true,
            isCorrect: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return question;
  } catch {
    return null;
  }
}

// ─── GET QUESTION BANK STATS ────────────────────────────────────────────────

export interface QuestionBankStats {
  total: number;
  draft: number;
  review: number;
  approved: number;
  rejected: number;
  archived: number;
  flagged: number;
  totalActive: number;
  duplicates: number;
}

export async function getQuestionBankStats(): Promise<QuestionBankStats> {
  try {
    await requireAdminSession();

    const [total, draft, review, approved, rejected, archived, flagged, duplicates] =
      await Promise.all([
        prisma.question.count(),
        prisma.question.count({ where: { status: "DRAFT" } }),
        prisma.question.count({ where: { status: "REVIEW" } }),
        prisma.question.count({ where: { status: "APPROVED" } }),
        prisma.question.count({ where: { status: "REJECTED" } }),
        prisma.question.count({ where: { status: "ARCHIVED" } }),
        prisma.question.count({ where: { status: "FLAGGED" } }),
        prisma.question.count({ where: { duplicateStatus: { in: ["EXACT", "SIMILAR"] } } as any }),
      ]);

    return {
      total,
      draft,
      review,
      approved,
      rejected,
      archived,
      flagged,
      totalActive: approved,
      duplicates,
    };
  } catch {
    return {
      total: 0,
      draft: 0,
      review: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
      flagged: 0,
      totalActive: 0,
      duplicates: 0,
    };
  }
}

// ─── GET QUESTION AUDIT HISTORY ───────────────────────────────────────────────

export interface QuestionAuditWithActor {
  id: string;
  questionId: string;
  action: string;
  previousStatus: string | null;
  nextStatus: string | null;
  previousVersion: number | null;
  nextVersion: number | null;
  metadata: any;
  actorId: string;
  reason: string | null;
  createdAt: Date;
  actor: { id: string; name: string | null; email: string | null } | null;
}

export async function getQuestionAuditHistory(
  questionId: string
): Promise<QuestionAuditWithActor[]> {
  try {
    await requireModeratorSession();

    const audits = await prisma.questionAuditLog.findMany({
      where: { questionId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (audits.length === 0) return [];

    const actorIds = [...new Set(audits.map((a) => a.actorId))];
    const actors = await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, email: true },
    });

    const actorMap = new Map(actors.map((a) => [a.id, a]));

    return audits.map((audit) => ({
      ...audit,
      actor: actorMap.get(audit.actorId) || null,
    }));
  } catch {
    return [];
  }
}

// ─── GOVERNANCE ANALYTICS & RISKS ───────────────────────────────────────────

export async function compareQuestionVersions(
  questionId: string,
  versionA: number,
  versionB: number
) {
  await requireModeratorSession();
  // Placeholder implementation for future version snapshots
  // Typically you would fetch from QuestionSnapshot or Audit metadata
  return { versionA, versionB, diff: "To be implemented" };
}

export async function detectGovernanceRisks() {
  await requireAdminSession();
  const highRiskEvents = await prisma.questionAuditLog.findMany({
    where: { action: { in: ["FLAGGED", "REJECTED"] } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return highRiskEvents;
}

// ─── DRAFT AUTOSAVE & VALIDATION ────────────────────────────────────────────

export async function autosaveQuestionDraft(
  data: unknown
): Promise<{ success: boolean; questionId?: string; questionCode?: string; error?: string }> {
  try {
    const { session } = await requireModeratorSession();
    // We use a less strict schema for parsing autosave data
    // It should be imported from validation but we can just use any for now or a permissive schema
    const { draftQuestionSchema } = await import("@/lib/validations/question");
    const parsed = draftQuestionSchema.parse(data);

    const { options, tags, ...questionData } = parsed;

    if (parsed.id) {
      // Update existing draft
      const existing = await prisma.question.findUnique({
        where: { id: parsed.id },
        select: { status: true, createdById: true },
      });

      if (!existing) {
        return { success: false, error: "Draft not found" };
      }

      if (existing.createdById !== session.user.id) {
        return { success: false, error: "Unauthorized" };
      }

      if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
        return { success: false, error: "Cannot autosave a non-draft question" };
      }

      const updateData: any = {
        question: questionData.question,
        explanation: questionData.explanation,
        subject: questionData.subject,
        topic: questionData.topic,
        category: questionData.category,
        language: questionData.language,
        marks: questionData.marks,
        negativeMarks: questionData.negativeMarks,
        difficulty: questionData.difficulty,
        tags: tags || [],
      };

      await prisma.question.update({
        where: { id: parsed.id },
        data: updateData,
      });

      // Update options (delete and recreate for simplicity during autosave, or upsert if id is present)
      if (options) {
        await prisma.questionOption.deleteMany({
          where: { questionId: parsed.id },
        });
        await prisma.questionOption.createMany({
          data: options.map((opt) => ({
            questionId: parsed.id!,
            optionText: opt.optionText || "",
            isCorrect: opt.isCorrect || false,
            order: opt.order,
          })),
        });
      }

      return { success: true, questionId: parsed.id };
    } else {
      // Create new draft
      if (!questionData.category) {
        return { success: false, error: "Category is required to create a draft" };
      }

      const questionCode = await generateQuestionCode(questionData.category);

      const question = await prisma.question.create({
        data: {
          questionCode,
          question: questionData.question || "",
          explanation: questionData.explanation,
          subject: questionData.subject || "",
          topic: questionData.topic,
          category: questionData.category,
          language: questionData.language || "en",
          marks: questionData.marks || 1,
          negativeMarks: questionData.negativeMarks || 0,
          difficulty: (questionData.difficulty as any) || "MEDIUM",
          tags: tags || [],
          status: "DRAFT",
          version: 1,
          isActive: true,
          usageCount: 0,
          createdById: session.user.id,
          options: {
            create: options
              ? options.map((opt) => ({
                  optionText: opt.optionText || "",
                  isCorrect: opt.isCorrect || false,
                  order: opt.order,
                }))
              : [],
          },
        },
      });

      return { success: true, questionId: question.id, questionCode };
    }
  } catch (error) {
    console.error("Autosave error:", error);
    return { success: false, error: "Autosave failed" };
  }
}

export async function validateQuestionLive(
  data: unknown
): Promise<{ valid: boolean; errors: string[] }> {
  try {
    const { createQuestionSchema } = await import("@/lib/validations/question");
    const result = createQuestionSchema.safeParse(data);
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.issues.map((e) => e.message),
      };
    }
    return { valid: true, errors: [] };
  } catch (e) {
    return { valid: false, errors: ["Validation exception"] };
  }
}

export async function checkDuplicateLive(
  data: {
    question: string;
    category?: string;
    subject?: string;
    explanation?: string;
    options?: { optionText: string; isCorrect: boolean }[];
  },
  excludeId?: string
) {
  try {
    const { session } = await requireModeratorSession();
    if (!data.question || data.question.trim().length < 10) {
      return { status: "NONE", highestScore: 0, candidates: [], explanationWarning: false };
    }
    const result = await checkForDuplicates(data, excludeId);
    return result;
  } catch (e) {
    return { status: "NONE", highestScore: 0, candidates: [], explanationWarning: false };
  }
}

export async function getDraftQuestions() {
  try {
    const { session } = await requireModeratorSession();

    const drafts = await prisma.question.findMany({
      where: {
        createdById: session.user.id,
        status: { in: ["DRAFT", "REJECTED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        questionCode: true,
        question: true,
        status: true,
        updatedAt: true,
      },
    });

    return drafts;
  } catch (error) {
    return [];
  }
}

// ─── BULK APPROVE ───────────────────────────────────────────────────────────

export async function bulkApproveQuestions(
  questionIds: string[]
): Promise<{ success: boolean; approvedCount?: number; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    if (!questionIds || questionIds.length === 0) {
      return { success: false, error: "No questions selected" };
    }

    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds }, status: "REVIEW" },
      select: { id: true, status: true, createdById: true },
    });

    if (questions.length === 0) {
      return { success: false, error: "No eligible questions found in REVIEW status" };
    }

    // Filter out self-authored questions for non-super-admins
    const eligible = questions.filter(
      (q) => q.createdById !== session.user.id || userRole === "SUPER_ADMIN"
    );

    if (eligible.length === 0) {
      return { success: false, error: "Cannot approve your own questions" };
    }

    const ids = eligible.map((q) => q.id);

    await prisma.question.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "APPROVED",
        reviewedById: session.user.id,
        approvedById: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: null,
      },
    });

    // Create audit entries
    for (const q of eligible) {
      await createQuestionAuditLog(
        q.id,
        "APPROVED",
        session.user.id,
        "REVIEW",
        "APPROVED",
        undefined,
        undefined,
        "Bulk approved"
      );
    }

    revalidateQuestionPaths();
    return { success: true, approvedCount: ids.length };
  } catch (error) {
    return { success: false, error: "Failed to bulk approve questions" };
  }
}

// ─── BULK REJECT ────────────────────────────────────────────────────────────

export async function bulkRejectQuestions(
  questionIds: string[],
  reason: string
): Promise<{ success: boolean; rejectedCount?: number; error?: string }> {
  try {
    const { session } = await requireAdminSession();

    if (!questionIds || questionIds.length === 0) {
      return { success: false, error: "No questions selected" };
    }
    if (!reason || reason.trim().length === 0) {
      return { success: false, error: "Rejection reason is required" };
    }

    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds }, status: "REVIEW" },
      select: { id: true },
    });

    if (questions.length === 0) {
      return { success: false, error: "No eligible questions found in REVIEW status" };
    }

    const ids = questions.map((q) => q.id);

    await prisma.question.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "REJECTED",
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: reason.trim(),
        reviewNotes: null,
      },
    });

    for (const q of questions) {
      await createQuestionAuditLog(
        q.id,
        "REJECTED",
        session.user.id,
        "REVIEW",
        "REJECTED",
        undefined,
        undefined,
        reason.trim()
      );
    }

    revalidateQuestionPaths();
    return { success: true, rejectedCount: ids.length };
  } catch (error) {
    return { success: false, error: "Failed to bulk reject questions" };
  }
}

// ─── RESTORE ARCHIVED ───────────────────────────────────────────────────────

export async function restoreArchivedQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }
    if (question.status !== "ARCHIVED") {
      return { success: false, error: "Question is not archived" };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { status: "DRAFT", isActive: true },
    });

    await createQuestionAuditLog(
      questionId,
      "UPDATED",
      session.user.id,
      "ARCHIVED",
      "DRAFT",
      undefined,
      undefined,
      "Restored from archive"
    );

    revalidateQuestionPaths(questionId);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to restore question" };
  }
}

// ─── PERMANENT DELETE (Super Admin Only) ────────────────────────────────────

export async function permanentlyDeleteQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { session, userRole } = await requireAdminSession();

    if (userRole !== "SUPER_ADMIN") {
      return { success: false, error: "Only Super Admins can permanently delete questions" };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true, _count: { select: { challenges: true } } },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }
    if (question._count.challenges > 0) {
      return { success: false, error: "Cannot delete a question attached to challenges" };
    }

    await prisma.question.delete({ where: { id: questionId } });

    await createAuditLog({
      action: "QUESTION_PERMANENTLY_DELETED",
      entityType: "QUESTION",
      entityId: questionId,
      actorId: session.user.id,
      severity: "HIGH",
    });

    revalidateQuestionPaths();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to permanently delete question" };
  }
}
