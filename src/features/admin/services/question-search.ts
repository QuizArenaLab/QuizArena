// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { QuestionStatus, ChallengeDifficulty } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma";

export type SearchFilters = {
  category?: string;
  subject?: string;
  difficulty?: string;
  status?: string;
  tags?: string[];
};

export async function searchQuestions({
  query,
  filters,
  page = 1,
  limit = 20,
}: {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role as string;
  const userId = session.user.id;

  const where: Prisma.QuestionWhereInput = {};

  // 1. RBAC constraints
  if (role === "USER") {
    throw new Error("Unauthorized role");
  } else if (role === "MODERATOR") {
    // Moderators can see: own drafts, approved questions, review-submitted questions
    where.OR = [
      { createdById: userId, status: "DRAFT" },
      { status: { in: ["APPROVED", "REVIEW"] } },
    ];
  }
  // Admin and Super Admin can see everything, so no RBAC base restriction

  // 2. Full-text search / Text matching
  if (query && query.trim() !== "") {
    const q = query.trim();
    if (where.OR) {
      // If we already have OR from RBAC, we must use AND to combine
      where.AND = [
        {
          OR: [
            { questionCode: { contains: q, mode: "insensitive" } },
            { question: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
          ],
        },
      ];
    } else {
      where.OR = [
        { questionCode: { contains: q, mode: "insensitive" } },
        { question: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  // 3. Exact Multi-Filters
  if (filters) {
    if (filters.category) where.category = filters.category;
    if (filters.subject) where.subject = filters.subject;
    if (filters.difficulty) where.difficulty = filters.difficulty as ChallengeDifficulty;
    if (filters.status) where.status = filters.status as QuestionStatus;
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }
  }

  const startTime = Date.now();

  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        createdBy: { select: { name: true, image: true } },
        analytics: true,
      },
    }),
  ]);

  const latencyMs = Date.now() - startTime;

  // Fire-and-forget analytics logging
  if (query || (filters && Object.keys(filters).length > 0)) {
    logSearchAnalytics({
      query: query || "",
      filters,
      resultCount: total,
      latencyMs,
    }).catch((e) => console.error("Failed to log search analytics:", e));
  }

  return {
    questions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function logSearchAnalytics({
  query,
  filters,
  resultCount,
  latencyMs,
}: {
  query: string;
  filters?: SearchFilters;
  resultCount: number;
  latencyMs: number;
}) {
  const session = await auth();

  await prisma.searchAnalytics.create({
    data: {
      userId: session?.user?.id || null,
      query,
      filters: filters ? (filters as any) : Prisma.JsonNull,
      resultCount,
      latencyMs,
    },
  });
}

export async function getSavedFilters() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.savedFilter.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveFilterPreset({
  name,
  description,
  filters,
}: {
  name: string;
  description?: string;
  filters: SearchFilters;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.savedFilter.create({
    data: {
      userId: session.user.id,
      name,
      description,
      filters: filters as any,
    },
  });
}

export async function deleteFilterPreset(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // ensure the filter belongs to the user
  const filter = await prisma.savedFilter.findUnique({ where: { id } });
  if (filter?.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.savedFilter.delete({ where: { id } });
}
