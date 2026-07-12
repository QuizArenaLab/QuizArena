// @ts-nocheck
"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import {
  createQuestionSchema,
  updateQuestionSchema,
  questionIdSchema,
  questionStatusTransitionSchema,
  questionFiltersSchema,
  isValidStatusTransition,
} from "@/lib/validations/question";
import { revalidatePath } from "next/cache";

async function validateModeratorAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }
  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    throw new Error("Forbidden: You do not have permission to manage questions");
  }
  return session;
}

export async function createQuestion(
  data: unknown
): Promise<{ success: boolean; questionId?: string; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = createQuestionSchema.parse(data);
    const { options, ...questionData } = parsed;

    const question = await prisma.question.create({
      data: {
        question: questionData.question,
        explanation: questionData.explanation,
        subject: questionData.subject,
        topic: questionData.topic,
        language: questionData.language,
        marks: questionData.marks,
        negativeMarks: questionData.negativeMarks,
        difficulty: questionData.difficulty,
        status: "DRAFT",
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

    revalidatePath("/dashboard/moderator/questions");
    return { success: true, questionId: question.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestion(data: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const parsed = updateQuestionSchema.parse(data);
    if (!parsed.id) {
      return { success: false, error: "Question ID is required" };
    }

    const existing = await prisma.question.findUnique({
      where: { id: parsed.id },
      select: { status: true },
    });

    if (!existing) {
      return { success: false, error: "Question not found" };
    }

    if (existing.status === "APPROVED" || existing.status === "ARCHIVED") {
      return { success: false, error: "Cannot update an approved or archived question" };
    }

    const { options, ...questionData } = parsed;

    const updateData: Record<string, unknown> = {};
    if (questionData.question) updateData.question = questionData.question;
    if (questionData.explanation !== undefined) updateData.explanation = questionData.explanation;
    if (questionData.subject) updateData.subject = questionData.subject;
    if (questionData.topic !== undefined) updateData.topic = questionData.topic;
    if (questionData.language) updateData.language = questionData.language;
    if (questionData.marks) updateData.marks = questionData.marks;
    if (questionData.negativeMarks !== undefined)
      updateData.negativeMarks = questionData.negativeMarks;
    if (questionData.difficulty) updateData.difficulty = questionData.difficulty;

    await prisma.question.update({
      where: { id: parsed.id },
      data: updateData,
    });

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

    revalidatePath("/dashboard/moderator/questions");
    revalidatePath(`/dashboard/moderator/questions/${parsed.id}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to update question" };
  }
}

export async function updateQuestionStatus(
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = questionStatusTransitionSchema.parse(data);
    const { id, newStatus } = parsed;

    const question = await prisma.question.findUnique({
      where: { id },
      select: { status: true, createdById: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (!isValidStatusTransition(question.status, newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${question.status} to ${newStatus}`,
      };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (newStatus === "APPROVED" && !isAdmin) {
      return { success: false, error: "Only admins can approve questions" };
    }

    if (newStatus === "ARCHIVED" && !isAdmin) {
      return { success: false, error: "Only admins can archive questions" };
    }

    await prisma.question.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/moderator/questions");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to update question status" };
  }
}

export async function moveToReview(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  return updateQuestionStatus({
    id: questionId,
    newStatus: "REVIEW",
  });
}

export async function approveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  return updateQuestionStatus({
    id: questionId,
    newStatus: "APPROVED",
  });
}

export async function rejectQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  return updateQuestionStatus({
    id: questionId,
    newStatus: "REJECTED",
  });
}

export async function archiveQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  return updateQuestionStatus({
    id: questionId,
    newStatus: "ARCHIVED",
  });
}

export async function deleteQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = questionIdSchema.parse({ id: questionId });

    const question = await prisma.question.findUnique({
      where: { id: parsed.id },
      select: { status: true, createdById: true, _count: { select: { challenges: true } } },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (question.status === "APPROVED") {
      return { success: false, error: "Cannot delete an approved question" };
    }

    if (question._count.challenges > 0) {
      return { success: false, error: "Cannot delete a question attached to challenges" };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (question.createdById !== session.user.id && !isAdmin) {
      return { success: false, error: "You can only delete questions you created" };
    }

    await prisma.question.delete({
      where: { id: parsed.id },
    });

    revalidatePath("/dashboard/moderator/questions");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete question" };
  }
}

interface QuestionListResult {
  questions: Array<{
    id: string;
    question: string;
    subject: string | null;
    topic: string | null;
    difficulty: string;
    status: string;
    marks: number;
    negativeMarks: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: { id: string; name: string | null; email: string | null } | null;
    _count: { challenges: number; options: number };
    options: Array<{ id: string; optionText: string; isCorrect: boolean; order: number }>;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export async function getQuestions(filters: unknown): Promise<QuestionListResult> {
  try {
    await validateModeratorAccess();

    const parsed = questionFiltersSchema.parse(filters);
    const { search, subject, topic, difficulty, status, page, limit } = parsed;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { topic: { contains: search, mode: "insensitive" } },
      ];
    }

    if (subject) where.subject = subject;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          question: true,
          subject: true,
          topic: true,
          difficulty: true,
          status: true,
          marks: true,
          negativeMarks: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
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
      questions: questions as QuestionListResult["questions"],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { questions: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getQuestionById(questionId: string): Promise<{
  id: string;
  question: string;
  explanation: string | null;
  subject: string | null;
  topic: string | null;
  language: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: { id: string; name: string | null; email: string | null } | null;
  _count: { challenges: number };
  options: Array<{ id: string; optionText: string; isCorrect: boolean; order: number }>;
} | null> {
  try {
    await validateModeratorAccess();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        question: true,
        explanation: true,
        subject: true,
        topic: true,
        language: true,
        marks: true,
        negativeMarks: true,
        difficulty: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { challenges: true } },
        options: {
          select: { id: true, optionText: true, isCorrect: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return question as typeof question;
  } catch {
    return null;
  }
}

export async function getApprovedQuestionsForChallenge(challengeId: string): Promise<
  Array<{
    id: string;
    question: string;
    subject: string | null;
    difficulty: string;
    marks: number;
    negativeMarks: number;
    options: Array<{ id: string; optionText: string; isCorrect: boolean; order: number }>;
  }>
> {
  const challengeQuestions = await prisma.challengeQuestion.findMany({
    where: { challengeId },
    select: { questionId: true },
  });

  const questionIds = challengeQuestions.map((cq) => cq.questionId);

  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds },
      status: "APPROVED",
    },
    select: {
      id: true,
      question: true,
      subject: true,
      difficulty: true,
      marks: true,
      negativeMarks: true,
      options: {
        select: { id: true, optionText: true, isCorrect: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return questions as typeof questions;
}

export async function approveQuestionAction(
  questionId: string,
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can approve questions" };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (question.status !== "REVIEW") {
      return { success: false, error: "Question must be in REVIEW status to be approved" };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "APPROVED",
        reviewedById: session.user.id,
        updatedAt: new Date(),
        reviewNotes: reviewNotes || null,
        rejectionReason: null,
      },
    });

    revalidatePath("/dashboard/moderator/questions");
    revalidatePath(`/dashboard/moderator/questions/${questionId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to approve question" };
  }
}

export async function rejectQuestionAction(
  questionId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can reject questions" };
    }

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

    if (question.status !== "REVIEW") {
      return { success: false, error: "Question must be in REVIEW status to be rejected" };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        status: "REJECTED",
        reviewedById: session.user.id,
        updatedAt: new Date(),
        rejectionReason: rejectionReason.trim(),
        reviewNotes: null,
      },
    });

    revalidatePath("/dashboard/moderator/questions");
    revalidatePath(`/dashboard/moderator/questions/${questionId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to reject question" };
  }
}

export async function getQuestionModerationQueue() {
  try {
    await validateModeratorAccess();

    const pendingReview = await prisma.question.findMany({
      where: { status: "REVIEW" },
      orderBy: { updatedAt: "asc" },
      select: {
        id: true,
        question: true,
        subject: true,
        difficulty: true,
        marks: true,
        createdBy: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    const recentApprovals = await prisma.question.findMany({
      where: {
        status: "APPROVED",
        // updatedAt: { not: null },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        question: true,
        status: true,
        reviewedBy: { select: { id: true, name: true, email: true } },
        updatedAt: true,
      },
    });

    const rejectedCount = await prisma.question.count({
      where: { status: "REJECTED" },
    });

    return { pendingReview, recentApprovals, rejectedCount };
  } catch {
    return { pendingReview: [], recentApprovals: [], rejectedCount: 0 };
  }
}
