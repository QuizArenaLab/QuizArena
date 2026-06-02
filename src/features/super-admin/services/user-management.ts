"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import { logModerationAction } from './audit/index';

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

export type AccountState = "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED";

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  onboardingStatus?: "completed" | "pending";
  activityState?: "active" | "inactive";
  accountState?: AccountState;
}

export interface UserListItem {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
  onboardingCompleted: boolean;
  accountState: AccountState;
  createdAt: Date;
  lastActiveAt: Date | null;
  totalAttempts: number;
  completedChallenges: number;
}

export interface UserListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  role: string;
  category: string | null;
  preparationLevel: string | null;
  onboardingCompleted: boolean;
  accountState: AccountState;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date | null;
  attempts: Array<{
    id: string;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    startedAt: Date;
    submittedAt: Date | null;
    challenge: { title: string; slug: string };
  }>;
  attemptStats: {
    totalAttempts: number;
    completedAttempts: number;
    averageScore: number;
    bestScore: number;
  };
  moderationNotes: Array<{
    id: string;
    note: string;
    createdAt: Date;
    createdBy: { name: string | null };
  }>;
}

export interface ModerationActionInput {
  userId: string;
  action: "suspend" | "reactivate" | "ban" | "unban" | "flag" | "unflag";
  reason?: string;
}

export async function getUsers(params: UserListParams): Promise<UserListResponse> {
  await validateAdminAccess();

  const {
    page = 1,
    limit = 20,
    search,
    role,
    onboardingStatus,
    activityState,
    accountState,
  } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    const searchLower = search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower, mode: "insensitive" } },
      { username: { contains: searchLower, mode: "insensitive" } },
      { email: { contains: searchLower, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") {
    where.role = role;
  }

  if (onboardingStatus === "completed") {
    where.onboardingCompleted = true;
  } else if (onboardingStatus === "pending") {
    where.onboardingCompleted = false;
  }

  if (activityState === "active") {
    where.attempts = {
      some: {
        startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    };
  } else if (activityState === "inactive") {
    where.attempts = {
      none: {
        startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    };
  }

  if (accountState) {
    where.accountState = accountState;
  }

  const [users, total] = await Promise.all([
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
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
        attempts: {
          select: {
            id: true,
            startedAt: true,
            submittedAt: true,
            score: true,
          },
        },
        accountState: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const userList: UserListItem[] = users.map((user) => {
    const lastActive =
      (user as any).attempts.length > 0
        ? (user as any).attempts.reduce(
            (latest: any, attempt: any) => {
              const attemptDate = attempt.startedAt;
              return !latest || attemptDate > latest ? attemptDate : latest;
            },
            null as Date | null
          )
        : null;

    const completed = (user as any).attempts.filter((a: any) => a.submittedAt !== null).length;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      accountState: (user.accountState as AccountState) || "ACTIVE",
      createdAt: user.createdAt,
      lastActiveAt: lastActive,
      totalAttempts: (user as any).attempts.length,
      completedChallenges: completed,
    };
  });

  return {
    users: userList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  await validateAdminAccess();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      emailVerified: true,
      role: true,
      examCategory: true,
      preparationLevel: true,
      onboardingCompleted: true,
      createdAt: true,
      updatedAt: true,
      attempts: {
        orderBy: { startedAt: "desc" },
        take: 20,
        select: {
          id: true,
          score: true,
          correctAnswers: true,
          totalAnswered: true,
          startedAt: true,
          submittedAt: true,
          challenge: { select: { title: true, slug: true } },
        },
      },
      moderationNotes: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          note: true,
          createdAt: true,
          createdBy: { select: { name: true } },
        },
      },
      accountState: true,
    },
  });

  if (!user) return null;

  const attemptStats = await prisma.attempt.aggregate({
    where: { userId },
    _count: { id: true },
    _avg: { score: true },
    _max: { score: true },
  });

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    role: user.role,
    category: user.examCategory,
    preparationLevel: user.preparationLevel,
    onboardingCompleted: user.onboardingCompleted,
    accountState: (user.accountState as AccountState) || "ACTIVE",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastActiveAt: (user as any).attempts[0]?.startedAt || null,
    attempts: (user as any).attempts.map((a: any) => ({
      id: a.id,
      score: a.score,
      correctAnswers: a.correctAnswers,
      wrongAnswers: a.wrongAnswers,
      startedAt: a.startedAt,
      submittedAt: a.submittedAt,
      challenge: a.challenge,
    })),
    attemptStats: {
      totalAttempts: attemptStats._count.id,
      completedAttempts: (user as any).attempts.filter((a: any) => a.submittedAt !== null).length,
      averageScore: Math.round((attemptStats._avg.score || 0) * 10) / 10,
      bestScore: attemptStats._max.score || 0,
    },
    moderationNotes: (user as any).moderationNotes.map((n: any) => ({
      id: n.id,
      note: n.note,
      createdAt: n.createdAt,
      createdBy: n.createdBy,
    })),
  };
}

export async function performModerationAction(
  input: ModerationActionInput
): Promise<{ success: boolean; error?: string }> {
  const session = await validateAdminAccess();
  const adminId = session.user.id;

  if (input.userId === adminId) {
    return { success: false, error: "Cannot perform moderation action on yourself" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { role: true, accountState: true },
  });

  if (!targetUser) {
    return { success: false, error: "User not found" };
  }

  if (targetUser.role === "SUPER_ADMIN") {
    return { success: false, error: "Cannot moderate super admin accounts" };
  }

  const adminRole = session.user.role as string;
  if (targetUser.role === "ADMIN" && adminRole !== "SUPER_ADMIN") {
    return { success: false, error: "Only super admins can moderate admin accounts" };
  }

  let newAccountState: AccountState;
  let isFlagged = false;

  switch (input.action) {
    case "suspend":
      newAccountState = "SUSPENDED";
      break;
    case "reactivate":
      newAccountState = "ACTIVE";
      break;
    case "ban":
      newAccountState = "BANNED";
      break;
    case "unban":
      newAccountState = "ACTIVE";
      break;
    case "flag":
      isFlagged = true;
      newAccountState = (targetUser.accountState as AccountState) || "ACTIVE";
      break;
    case "unflag":
      isFlagged = false;
      newAccountState = (targetUser.accountState as AccountState) || "ACTIVE";
      break;
    default:
      return { success: false, error: "Invalid action" };
  }

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      accountState: newAccountState,
      flagged: isFlagged,
    },
  });

  if (input.reason) {
    await prisma.moderationNote.create({
      data: {
        userId: input.userId,
        createdById: adminId,
        note: `[${input.action.toUpperCase()}] ${input.reason}`,
      },
    });
  }

  // Generate an immutable centralized audit log
  await logModerationAction(
    adminId,
    input.userId,
    input.action,
    input.reason || "No reason provided"
  );

  return { success: true };
}

export async function addModerationNote(
  userId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  if (!note.trim()) {
    return { success: false, error: "Note cannot be empty" };
  }

  const session = await validateAdminAccess();
  const adminId = session.user.id;

  await prisma.moderationNote.create({
    data: {
      userId,
      createdById: adminId,
      note: note.trim(),
    },
  });

  return { success: true };
}

export async function getModerationStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  flaggedUsers: number;
  recentSuspensions: number;
  recentBans: number;
}> {
  await validateAdminAccess();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    bannedUsers,
    flaggedUsers,
    recentSuspensions,
    recentBans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { accountState: "ACTIVE" } }),
    prisma.user.count({ where: { accountState: "SUSPENDED" } }),
    prisma.user.count({ where: { accountState: "BANNED" } }),
    prisma.user.count({ where: { flagged: true } }),
    prisma.user.count({
      where: {
        accountState: "SUSPENDED",
        updatedAt: { gte: weekAgo },
      },
    }),
    prisma.user.count({
      where: {
        accountState: "BANNED",
        updatedAt: { gte: weekAgo },
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    bannedUsers,
    flaggedUsers,
    recentSuspensions,
    recentBans,
  };
}
