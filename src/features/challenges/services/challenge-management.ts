"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import {
  createChallengeSchema,
  updateChallengeSchema,
  challengeIdSchema,
  challengeStatusTransitionSchema,
  challengeFiltersSchema,
  generateSlug,
  scheduleChallengeSchema,
} from "@/lib/validations/challenge";
import { revalidatePath } from "next/cache";
import { generateChallengeSnapshots, verifySnapshotIntegrity } from "@/features/exam/services/snapshot";

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["DRAFT"],
  REVIEW: ["DRAFT", "SCHEDULED", "LIVE"],
  SCHEDULED: ["DRAFT", "LIVE"],
  PUBLISHED: ["ENDED", "ARCHIVED"],
  EXPIRED: ["ARCHIVED", "DRAFT"],
  ARCHIVED: ["DRAFT"],
};

async function validateModeratorAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }
  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    throw new Error("Forbidden: You do not have permission to manage challenges");
  }
  return session;
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await prisma.challenge.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

function validateStatusTransition(current: string, target: string): boolean {
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

export async function createChallenge(
  data: unknown
): Promise<{ success: boolean; challengeId?: string; error?: string }> {
  try {
    await validateModeratorAccess();

    const parsed = createChallengeSchema.parse(data);
    const slug = await generateUniqueSlug(parsed.title);

    const challenge = await prisma.challenge.create({
      data: {
        title: parsed.title,
        slug,
        description: parsed.description,
        category: parsed.category,
        difficulty: parsed.difficulty,
        durationInMinutes: parsed.durationInMinutes,
        totalQuestions: parsed.totalQuestions,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    return { success: true, challengeId: challenge.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to create challenge" };
  }
}

export async function updateChallenge(
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const parsed = updateChallengeSchema.parse(data);
    if (!parsed.id) {
      return { success: false, error: "Challenge ID is required" };
    }

    const existing = await prisma.challenge.findUnique({
      where: { id: parsed.id },
      select: { status: true },
    });

    if (!existing) {
      return { success: false, error: "Challenge not found" };
    }

    if (existing.status === "LIVE" || existing.status === "ARCHIVED") {
      return { success: false, error: "Cannot update a published or archived challenge" };
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.title) updateData.title = parsed.title;
    if (parsed.description !== undefined) updateData.description = parsed.description;
    if (parsed.category) updateData.category = parsed.category;
    if (parsed.difficulty) updateData.difficulty = parsed.difficulty;
    if (parsed.durationInMinutes) updateData.durationInMinutes = parsed.durationInMinutes;
    if (parsed.totalQuestions) updateData.totalQuestions = parsed.totalQuestions;

    await prisma.challenge.update({
      where: { id: parsed.id },
      data: updateData,
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${parsed.id}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to update challenge" };
  }
}

export async function updateChallengeStatus(
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = challengeStatusTransitionSchema.parse(data);
    const { id, newStatus } = parsed;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      select: { status: true, createdById: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (!validateStatusTransition(challenge.status, newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${challenge.status} to ${newStatus}`,
      };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (newStatus === "LIVE" && !isAdmin) {
      return { success: false, error: "Only admins can publish challenges" };
    }

    if (newStatus === "ARCHIVED" && !isAdmin) {
      return { success: false, error: "Only admins can archive challenges" };
    }

    if (newStatus === "LIVE" || newStatus === "SCHEDULED") {
      try {
        await generateChallengeSnapshots(id);
      } catch (err) {
        return { success: false, error: "Failed to generate runtime snapshots for this challenge" };
      }
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
    };

    if (newStatus === "LIVE") {
      updateData.publishedAt = new Date();
    }

    await prisma.challenge.update({
      where: { id },
      data: updateData as never,
    });

    revalidatePath("/dashboard/moderator/challenges");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to update challenge status" };
  }
}

export async function moveToReview(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  return updateChallengeStatus({
    id: challengeId,
    newStatus: "DRAFT",
  });
}

export async function publishChallenge(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  return updateChallengeStatus({
    id: challengeId,
    newStatus: "LIVE",
  });
}

export async function archiveChallenge(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  return updateChallengeStatus({
    id: challengeId,
    newStatus: "ARCHIVED",
  });
}

export async function deleteChallenge(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = challengeIdSchema.parse({ id: challengeId });

    const challenge = await prisma.challenge.findUnique({
      where: { id: parsed.id },
      select: {
        status: true,
        createdById: true,
        _count: { select: { attempts: true, questions: true } },
      },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status === "LIVE") {
      return { success: false, error: "Cannot delete a published challenge" };
    }

    if (challenge._count.attempts > 0 || challenge._count.questions > 0) {
      return { success: false, error: "Cannot delete a challenge with questions or attempts" };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (challenge.createdById !== session.user.id && !isAdmin) {
      return { success: false, error: "You can only delete challenges you created" };
    }

    await prisma.challenge.delete({
      where: { id: parsed.id },
    });

    revalidatePath("/dashboard/moderator/challenges");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete challenge" };
  }
}

interface ChallengeListResult {
  challenges: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string | null;
    difficulty: string;
    durationInMinutes: number;
    totalQuestions: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    createdBy: { id: string; name: string | null; email: string | null } | null;
    _count: { attempts: number; questions: number };
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export async function getChallenges(filters: unknown): Promise<ChallengeListResult> {
  try {
    await validateModeratorAccess();

    const parsed = challengeFiltersSchema.parse(filters);
    const { search, status, difficulty, category, page, limit } = parsed;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          difficulty: true,
          durationInMinutes: true,
          totalQuestions: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { attempts: true, questions: true } },
        },
      }),
      prisma.challenge.count({ where }),
    ]);

    return {
      challenges: challenges as ChallengeListResult["challenges"],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { challenges: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getChallengeById(challengeId: string): Promise<{
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  durationInMinutes: number;
  totalQuestions: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  createdBy: { id: string; name: string | null; email: string | null } | null;
  _count: { attempts: number; questions: number };
} | null> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        difficulty: true,
        durationInMinutes: true,
        totalQuestions: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { attempts: true, questions: true } },
      },
    });

    return challenge as typeof challenge;
  } catch {
    return null;
  }
}

export async function getChallengeBySlug(slug: string): Promise<{
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  durationInMinutes: number;
  totalQuestions: number;
  status: string;
} | null> {
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      difficulty: true,
      durationInMinutes: true,
      totalQuestions: true,
      status: true,
    },
  });

  return challenge as typeof challenge;
}

export async function addQuestionToChallenge(
  challengeId: string,
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status === "LIVE" || challenge.status === "ARCHIVED") {
      return { success: false, error: "Cannot modify a published or archived challenge" };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (question.status !== "APPROVED") {
      return { success: false, error: "Only APPROVED questions can be added to challenges" };
    }

    const existingLink = await prisma.challengeQuestion.findUnique({
      where: {
        challengeId_questionId: {
          challengeId,
          questionId,
        },
      },
    });

    if (existingLink) {
      return { success: false, error: "Question already exists in this challenge" };
    }

    const maxOrder = await prisma.challengeQuestion.findFirst({
      where: { challengeId },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });

    await prisma.challengeQuestion.create({
      data: {
        challengeId,
        questionId,
        orderIndex: (maxOrder?.orderIndex ?? -1) + 1,
      },
    });

    await updateChallengeQuestionCount(challengeId);

    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to add question" };
  }
}

export async function removeQuestionFromChallenge(
  challengeId: string,
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status === "LIVE" || challenge.status === "ARCHIVED") {
      return { success: false, error: "Cannot modify a published or archived challenge" };
    }

    await prisma.challengeQuestion.delete({
      where: {
        challengeId_questionId: {
          challengeId,
          questionId,
        },
      },
    });

    await updateChallengeQuestionCount(challengeId);

    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to remove question" };
  }
}

export async function reorderChallengeQuestions(
  challengeId: string,
  questionOrders: Array<{ questionId: string; orderIndex: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status === "LIVE" || challenge.status === "ARCHIVED") {
      return { success: false, error: "Cannot modify a published or archived challenge" };
    }

    await Promise.all(
      questionOrders.map(({ questionId, orderIndex }) =>
        prisma.challengeQuestion.update({
          where: {
            challengeId_questionId: {
              challengeId,
              questionId,
            },
          },
          data: { orderIndex },
        })
      )
    );

    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to reorder questions" };
  }
}

async function updateChallengeQuestionCount(challengeId: string) {
  const count = await prisma.challengeQuestion.count({
    where: { challengeId },
  });

  await prisma.challenge.update({
    where: { id: challengeId },
    data: {
      totalQuestions: count,
    },
  });
}

export interface ChallengeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateChallengeForPublishing(
  challengeId: string
): Promise<ChallengeValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      questions: {
        include: {
          question: {
            select: { status: true },
          },
        },
      },
    },
  });

  if (!challenge) {
    return { valid: false, errors: ["Challenge not found"], warnings: [] };
  }

  if (!challenge.title || challenge.title.trim().length === 0) {
    errors.push("Challenge title is required");
  }

  if (challenge.durationInMinutes < 5 || challenge.durationInMinutes > 180) {
    errors.push("Duration must be between 5 and 180 minutes");
  }

  if (challenge.questions.length === 0) {
    errors.push("Challenge must have at least one question");
  }

  if (challenge.questions.length > 200) {
    errors.push("Challenge cannot have more than 200 questions");
  }

  const nonApprovedQuestions = challenge.questions.filter(
    (cq) => cq.question.status !== "APPROVED"
  );

  if (nonApprovedQuestions.length > 0) {
    errors.push(
      `Challenge contains ${nonApprovedQuestions.length} non-approved question(s). Only APPROVED questions can be published.`
    );
  }

  const duplicateQuestionIds = challenge.questions.map((cq) => cq.questionId);
  const uniqueQuestionIds = new Set(duplicateQuestionIds);

  if (duplicateQuestionIds.length !== uniqueQuestionIds.size) {
    errors.push("Challenge contains duplicate questions");
  }

  if (challenge.totalQuestions !== challenge.questions.length) {
    warnings.push("Total questions count doesn't match attached questions");
  }

  // Pre-flight check: ensure snapshots can be generated or exist correctly
  try {
    await generateChallengeSnapshots(challengeId);
    const integrityOk = await verifySnapshotIntegrity(challengeId);
    if (!integrityOk) {
      errors.push("Snapshot integrity validation failed. Some questions may be malformed.");
    }
  } catch (err) {
    errors.push("Failed to generate or validate snapshots for this challenge.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function getChallengeQuestions(challengeId: string): Promise<
  Array<{
    id: string;
    questionId: string;
    orderIndex: number;
    question: {
      id: string;
      question: string;
      subject: string | null;
      topic: string | null;
      difficulty: string;
      marks: number;
      negativeMarks: number;
      status: string;
      options: Array<{ id: string; optionText: string; isCorrect: boolean; order: number }>;
    };
  }>
> {
  try {
    await validateModeratorAccess();

    const questions = await prisma.challengeQuestion.findMany({
      where: { challengeId },
      orderBy: { orderIndex: "asc" },
      include: {
        question: {
          include: {
            options: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return questions as typeof questions;
  } catch {
    return [];
  }
}

export async function getAvailableQuestionsForChallenge(
  challengeId: string,
  filters: {
    search?: string;
    subject?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }
) {
  try {
    await validateModeratorAccess();

    const { search, subject, difficulty, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const attachedQuestionIds = await prisma.challengeQuestion.findMany({
      where: { challengeId },
      select: { questionId: true },
    });

    const excludedIds = attachedQuestionIds.map((aq) => aq.questionId);

    const where: Record<string, unknown> = {
      status: "APPROVED",
      id: { notIn: excludedIds },
    };

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { topic: { contains: search, mode: "insensitive" } },
      ];
    }

    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;

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
          marks: true,
          negativeMarks: true,
          status: true,
          options: {
            select: { id: true, optionText: true, isCorrect: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return {
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { questions: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function scheduleChallenge(
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const parsed = scheduleChallengeSchema.parse(data);
    const { id, startsAt, endsAt } = parsed;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      select: { status: true, _count: { select: { questions: true } } },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "DRAFT") {
      return { success: false, error: "Only DRAFT challenges can be scheduled" };
    }

    if (challenge._count.questions === 0) {
      return { success: false, error: "Challenge must have at least one question" };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can schedule challenges" };
    }

    await prisma.challenge.update({
      where: { id },
      data: {
        status: "SCHEDULED",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${id}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to schedule challenge" };
  }
}

export async function publishChallengeNow(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "SCHEDULED" && challenge.status !== "DRAFT") {
      return { success: false, error: "Challenge must be in SCHEDULED or DRAFT status" };
    }

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can publish challenges" };
    }

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: "LIVE",
        startsAt: new Date(),
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to publish challenge" };
  }
}

export async function cancelSchedule(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "SCHEDULED") {
      return { success: false, error: "Challenge is not scheduled" };
    }

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: "DRAFT",
        startsAt: undefined,
        endsAt: null,
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to cancel schedule" };
  }
}

export async function processScheduledChallenges(): Promise<{
  published: number;
  expired: number;
}> {
  const now = new Date();

  const publishedCount = await prisma.challenge.updateMany({
    where: {
      status: "SCHEDULED",
      startsAt: { lte: now },
    },
    data: {
      status: "LIVE",
      startsAt: now,
    },
  });

  const expiredCount = await prisma.challenge.updateMany({
    where: {
      status: "LIVE",
      endsAt: { lte: now },
    },
    data: {
      status: "ENDED",
    },
  });

  return {
    published: publishedCount.count,
    expired: expiredCount.count,
  };
}

export async function expireChallenge(
  challengeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await validateModeratorAccess();

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "LIVE") {
      return { success: false, error: "Only published challenges can be expired" };
    }

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: "ENDED",
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to expire challenge" };
  }
}

export async function getScheduledChallenges() {
  try {
    await validateModeratorAccess();

    const now = new Date();

    const upcoming = await prisma.challenge.findMany({
      where: {
        status: "SCHEDULED",
        startsAt: { gt: now },
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
      },
    });

    const readyToPublish = await prisma.challenge.findMany({
      where: {
        status: "SCHEDULED",
        startsAt: { lte: now },
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
      },
    });

    return { upcoming, readyToPublish };
  } catch {
    return { upcoming: [], readyToPublish: [] };
  }
}

export async function approveChallenge(
  challengeId: string,
  reviewNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can approve challenges" };
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "DRAFT" && challenge.status !== "SCHEDULED") {
      return {
        success: false,
        error: "Challenge must be in DRAFT or SCHEDULED status to be approved",
      };
    }

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: "SCHEDULED",
        reviewedById: session.user.id,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to approve challenge" };
  }
}

export async function rejectChallenge(
  challengeId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await validateModeratorAccess();

    const userRole = (session.user.role as string) || "USER";
    const isAdmin = hasMinimumRole(userRole, ROLE.ADMIN);

    if (!isAdmin) {
      return { success: false, error: "Only admins can reject challenges" };
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return { success: false, error: "Rejection reason is required" };
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { status: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.status !== "DRAFT" && challenge.status !== "SCHEDULED") {
      return {
        success: false,
        error: "Challenge must be in DRAFT or SCHEDULED status to be rejected",
      };
    }

    await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        status: "DRAFT",
        reviewedById: session.user.id,
        updatedAt: new Date(),
        startsAt: undefined,
      },
    });

    revalidatePath("/dashboard/moderator/challenges");
    revalidatePath(`/dashboard/moderator/challenges/${challengeId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to reject challenge" };
  }
}

export async function getModerationQueue() {
  try {
    await validateModeratorAccess();

    const pendingReview = await prisma.challenge.findMany({
      where: { status: "DRAFT" },
      orderBy: { updatedAt: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        difficulty: true,
        totalQuestions: true,
        createdBy: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    const recentApprovals = await prisma.challenge.findMany({
      where: {
        status: { in: ["SCHEDULED", "LIVE"] },
        // updatedAt: { not: null },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        status: true,
        reviewedBy: { select: { id: true, name: true, email: true } },
        updatedAt: true,
      },
    });

    const rejectedCount = await prisma.challenge.count({
      where: {
        status: "DRAFT",
        // rejectionReason: { not: null },
      },
    });

    return { pendingReview, recentApprovals, rejectedCount };
  } catch {
    return { pendingReview: [], recentApprovals: [], rejectedCount: 0 };
  }
}
