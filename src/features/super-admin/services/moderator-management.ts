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

export type ModeratorStatus = $Enums.ModeratorStatus;

export interface ModeratorListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  activityState?: string;
  performance?: string;
}

export interface ModeratorListItem {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
  moderatorStatus: ModeratorStatus;
  createdAt: Date;
  lastActiveAt: Date | null;
  challengesCreated: number;
  reviewsCompleted: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
}

export interface ModeratorListResponse {
  moderators: ModeratorListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ModeratorProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
  moderatorStatus: ModeratorStatus;
  createdAt: Date;
  lastActiveAt: Date | null;
  challenges: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: Date;
    publishedAt: Date | null;
  }>;
  reviewHistory: Array<{
    id: string;
    type: "challenge" | "question";
    title: string;
    status: string;
    action: "approved" | "rejected";
    updatedAt: Date;
  }>;
  performance: {
    totalChallengesCreated: number;
    totalReviewsCompleted: number;
    approvedCount: number;
    rejectedCount: number;
    approvalRate: number;
    publishingFrequency: number;
    recentActivity: Array<{ date: string; reviews: number }>;
  };
  operationalNotes: Array<{
    id: string;
    note: string;
    createdAt: Date;
    createdBy: { name: string | null };
  }>;
}

export interface ModeratorActionInput {
  moderatorId: string;
  action: "suspend" | "reactivate" | "restrict" | "restore" | "demote";
  reason?: string;
}

export async function getModerators(params: ModeratorListParams): Promise<ModeratorListResponse> {
  await validateAdminAccess();

  const { page = 1, limit = 20, search, status, activityState, performance } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    role: { in: ["MODERATOR", "ADMIN"] },
  };

  if (search) {
    const searchLower = search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower, mode: "insensitive" } },
      { username: { contains: searchLower, mode: "insensitive" } },
      { email: { contains: searchLower, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all" && status in $Enums.ModeratorStatus) {
    where.moderatorStatus = status as $Enums.ModeratorStatus;
  }

  if (activityState === "active") {
    where.updatedAt = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  } else if (activityState === "inactive") {
    where.updatedAt = { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  }

  const [moderators] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        moderatorStatus: true,
        createdAt: true,
        updatedAt: true,
        createdChallenges: { select: { id: true } },
        reviewedChallenges: { select: { id: true, status: true } },
        createdQuestions: { select: { id: true } },
        reviewedQuestions: { select: { id: true, status: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const moderatorList: ModeratorListItem[] = moderators.map((mod) => {
    const approvedChallenges = mod.reviewedChallenges.filter(
      (r: any) => r.status === $Enums.ChallengeStatus.LIVE
    ).length;
    const rejectedChallenges = mod.reviewedChallenges.filter(
      (r: any) => r.status === $Enums.ChallengeStatus.ARCHIVED
    ).length;
    const totalReviews = mod.reviewedChallenges.length + mod.reviewedQuestions.length;
    const approvalRate =
      totalReviews > 0 ? Math.round((approvedChallenges / totalReviews) * 100) : 0;

    return {
      id: mod.id,
      name: mod.name,
      username: mod.username,
      email: mod.email,
      role: mod.role,
      moderatorStatus: mod.moderatorStatus || $Enums.ModeratorStatus.ACTIVE,
      createdAt: mod.createdAt,
      lastActiveAt: mod.updatedAt,
      challengesCreated: mod.createdChallenges.length,
      reviewsCompleted: totalReviews,
      approvedCount: approvedChallenges,
      rejectedCount: rejectedChallenges,
      approvalRate,
    };
  });

  let filteredList = moderatorList;
  if (performance) {
    if (performance === "high") {
      filteredList = moderatorList.filter((m) => m.approvalRate >= 80);
    } else if (performance === "medium") {
      filteredList = moderatorList.filter((m) => m.approvalRate >= 50 && m.approvalRate < 80);
    } else if (performance === "low") {
      filteredList = moderatorList.filter((m) => m.approvalRate < 50);
    }
  }

  const start = (page - 1) * limit;
  const paginatedList = filteredList.slice(start, start + limit);

  return {
    moderators: paginatedList,
    total: filteredList.length,
    page,
    limit,
    totalPages: Math.ceil(filteredList.length / limit),
  };
}

export async function getModeratorProfile(moderatorId: string): Promise<ModeratorProfile | null> {
  await validateAdminAccess();

  const moderator = await prisma.user.findUnique({
    where: { id: moderatorId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      moderatorStatus: true,
      createdAt: true,
      updatedAt: true,
      createdChallenges: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
        },
      },
      reviewedChallenges: {
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, title: true, status: true, updatedAt: true },
      },
      moderatorNotes: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, note: true, createdAt: true, createdBy: { select: { name: true } } },
      },
    },
  });

  if (!moderator || !["MODERATOR", "ADMIN"].includes(moderator.role)) {
    return null;
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentReviews = await prisma.attempt.groupBy({
    by: ["startedAt"],
    where: { challenge: { reviewedById: moderatorId }, startedAt: { gte: weekAgo } },
    _count: { id: true },
  });

  const recentActivity = recentReviews.map((r: any) => ({
    date: r.startedAt.toISOString().split("T")[0],
    reviews: r._count.id,
  }));

  const totalChallengesCreated = (moderator as any).createdChallenges.length;
  const totalReviewsCompleted = (moderator as any).reviewedChallenges.length;
  const approvedCount = (moderator as any).reviewedChallenges.filter(
    (r: any) => r.status === $Enums.ChallengeStatus.LIVE
  ).length;
  const rejectedCount = (moderator as any).reviewedChallenges.filter(
    (r: any) => r.status === $Enums.ChallengeStatus.ARCHIVED
  ).length;
  const approvalRate =
    totalReviewsCompleted > 0 ? Math.round((approvedCount / totalReviewsCompleted) * 100) : 0;

  const daysSinceJoined = Math.max(
    1,
    Math.floor((Date.now() - moderator.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );

  return {
    id: moderator.id,
    name: moderator.name,
    username: moderator.username,
    email: moderator.email,
    role: moderator.role,
    moderatorStatus: moderator.moderatorStatus || $Enums.ModeratorStatus.ACTIVE,
    createdAt: moderator.createdAt,
    lastActiveAt: moderator.updatedAt,
    challenges: (moderator as any).createdChallenges.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      status: c.status,
      createdAt: c.createdAt,
      publishedAt: c.publishedAt,
    })),
    reviewHistory: (moderator as any).reviewedChallenges.map((r: any) => ({
      id: r.id,
      type: "challenge" as const,
      title: r.title,
      status: r.status,
      action:
        r.status === $Enums.ChallengeStatus.LIVE ? ("approved" as const) : ("rejected" as const),
      updatedAt: r.reviewedAt!,
    })),
    performance: {
      totalChallengesCreated,
      totalReviewsCompleted,
      approvedCount,
      rejectedCount,
      approvalRate,
      publishingFrequency: Math.round((totalChallengesCreated / daysSinceJoined) * 100) / 100,
      recentActivity,
    },
    operationalNotes: (moderator as any).moderatorNotes.map((n: any) => ({
      id: n.id,
      note: n.note,
      createdAt: n.createdAt,
      createdBy: n.createdBy,
    })),
  };
}

export async function performModeratorAction(
  input: ModeratorActionInput
): Promise<{ success: boolean; error?: string }> {
  const session = await validateAdminAccess();
  const adminId = session.user.id;
  const adminRole = session.user.role as string;

  if (input.moderatorId === adminId) {
    return { success: false, error: "Cannot perform action on yourself" };
  }

  const targetModerator = await prisma.user.findUnique({
    where: { id: input.moderatorId },
    select: { role: true, moderatorStatus: true },
  });

  if (!targetModerator || !["MODERATOR", "ADMIN"].includes(targetModerator.role)) {
    return { success: false, error: "User is not a moderator" };
  }

  if (targetModerator.role === "ADMIN" && adminRole !== "SUPER_ADMIN") {
    return { success: false, error: "Only super admins can manage admin accounts" };
  }

  let newStatus: $Enums.ModeratorStatus;
  let newRole: string | undefined;

  switch (input.action) {
    case "suspend":
      newStatus = $Enums.ModeratorStatus.SUSPENDED;
      break;
    case "reactivate":
      newStatus = $Enums.ModeratorStatus.ACTIVE;
      break;
    case "restrict":
      newStatus = $Enums.ModeratorStatus.RESTRICTED;
      break;
    case "restore":
      newStatus = $Enums.ModeratorStatus.ACTIVE;
      break;
    case "demote":
      newStatus = $Enums.ModeratorStatus.INACTIVE;
      newRole = "USER";
      break;
    default:
      return { success: false, error: "Invalid action" };
  }

  const updateData: Record<string, unknown> = {
    moderatorStatus: newStatus,
  };

  if (newRole) {
    updateData.role = newRole;
  }

  await prisma.user.update({
    where: { id: input.moderatorId },
    data: updateData,
  });

  if (input.reason) {
    await prisma.moderatorNote.create({
      data: {
        moderatorId: input.moderatorId,
        createdById: adminId,
        note: `[${input.action.toUpperCase()}] ${input.reason}`,
      },
    });
  }

  return { success: true };
}

export async function addModeratorNote(
  moderatorId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  if (!note.trim()) {
    return { success: false, error: "Note cannot be empty" };
  }

  const session = await validateAdminAccess();
  const adminId = session.user.id;

  await prisma.moderatorNote.create({
    data: {
      moderatorId,
      createdById: adminId,
      note: note.trim(),
    },
  });

  return { success: true };
}

export async function getModeratorStats(): Promise<{
  totalModerators: number;
  activeModerators: number;
  suspendedModerators: number;
  restrictedModerators: number;
  averageApprovalRate: number;
  totalChallengesCreated: number;
  totalReviewsCompleted: number;
}> {
  await validateAdminAccess();

  const [moderators, challengeStats, reviewStats] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["MODERATOR", "ADMIN"] } },
      select: {
        moderatorStatus: true,
        createdChallenges: { select: { id: true } },
        reviewedChallenges: { select: { id: true, status: true } },
      },
    }),
    prisma.challenge.count({
      where: { createdBy: { role: { in: ["MODERATOR", "ADMIN"] } } },
    }),
    prisma.challenge.count({
      where: { reviewedBy: { role: { in: ["MODERATOR", "ADMIN"] } } },
    }),
  ]);

  const activeCount = moderators.filter(
    (m) => m.moderatorStatus === $Enums.ModeratorStatus.ACTIVE || !m.moderatorStatus
  ).length;
  const suspendedCount = moderators.filter(
    (m) => m.moderatorStatus === $Enums.ModeratorStatus.SUSPENDED
  ).length;
  const restrictedCount = moderators.filter(
    (m) => m.moderatorStatus === $Enums.ModeratorStatus.RESTRICTED
  ).length;

  let totalApproval = 0;
  let totalWithReviews = 0;
  for (const mod of moderators) {
    const approved = mod.reviewedChallenges.filter(
      (r: any) => r.status === $Enums.ChallengeStatus.LIVE
    ).length;
    const total = mod.reviewedChallenges.length;
    if (total > 0) {
      totalApproval += approved;
      totalWithReviews += total;
    }
  }

  const avgApproval =
    totalWithReviews > 0 ? Math.round((totalApproval / totalWithReviews) * 100) : 0;

  return {
    totalModerators: moderators.length,
    activeModerators: activeCount,
    suspendedModerators: suspendedCount,
    restrictedModerators: restrictedCount,
    averageApprovalRate: avgApproval,
    totalChallengesCreated: challengeStats,
    totalReviewsCompleted: reviewStats,
  };
}
