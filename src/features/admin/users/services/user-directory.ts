"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";

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

export interface UserDirectoryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}

export type HealthStatus = "Healthy" | "Warning" | "Restricted" | "Suspended";

export interface UserDirectoryItem {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  examCategory: string | null;
  preparationLevel: string | null;
  role: string;
  subscription: "Free" | "Premium" | "Challenge Pass";
  health: HealthStatus;
  competitions: number;
  lastActiveAt: Date | null;
  joinedAt: Date;
}

export interface UserDirectoryResponse {
  users: UserDirectoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchUserDirectory(
  params: UserDirectoryParams
): Promise<UserDirectoryResponse> {
  await validateAdminAccess();

  const { page = 1, limit = 20, search, filter = "all" } = params;
  const skip = (page - 1) * limit;
  const where: Record<string, any> = {};

  if (search) {
    const searchLower = search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower, mode: "insensitive" } },
      { username: { contains: searchLower, mode: "insensitive" } },
      { email: { contains: searchLower, mode: "insensitive" } },
      { id: { equals: searchLower } },
    ];
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter !== "all") {
    switch (filter) {
      case "premium":
        where.subscriptions = { some: { status: "ACTIVE" } };
        break;
      case "active":
        where.attempts = { some: { startedAt: { gte: sevenDaysAgo } } };
        break;
      case "new":
        where.createdAt = { gte: today };
        break;
      case "inactive":
        where.attempts = { none: { startedAt: { gte: sevenDaysAgo } } };
        break;
      case "flagged":
        where.flagged = true;
        break;
      case "suspended":
        where.accountState = "SUSPENDED";
        break;
    }
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
        examCategory: true,
        preparationLevel: true,
        role: true,
        accountState: true,
        flagged: true,
        createdAt: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          select: {
            plan: { select: { name: true } },
          },
        },
        attempts: {
          select: { startedAt: true },
          orderBy: { startedAt: "desc" },
          take: 1, // We only need the latest for last active
        },
        _count: {
          select: { attempts: true },
        },
        targetedReports: {
          where: {
            status: { in: ["OPEN", "UNDER_REVIEW"] },
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const userList: UserDirectoryItem[] = users.map((user: any) => {
    let subscription: "Free" | "Premium" | "Challenge Pass" = "Free";
    if (user.subscriptions.length > 0) {
      const planName = user.subscriptions[0].plan.name.toLowerCase();
      if (planName.includes("challenge pass")) {
        subscription = "Challenge Pass";
      } else {
        subscription = "Premium";
      }
    }

    let health: HealthStatus = "Healthy";
    if (user.accountState === "SUSPENDED" || user.accountState === "BANNED") {
      health = "Suspended";
    } else if (user.accountState === "DEACTIVATED" || user.flagged) {
      health = "Restricted";
    } else if (user.targetedReports && user.targetedReports.length > 0) {
      health = "Warning";
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      examCategory: user.examCategory,
      preparationLevel: user.preparationLevel,
      role: user.role,
      subscription,
      health,
      competitions: user._count.attempts,
      lastActiveAt: user.attempts.length > 0 ? user.attempts[0].startedAt : null,
      joinedAt: user.createdAt,
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
