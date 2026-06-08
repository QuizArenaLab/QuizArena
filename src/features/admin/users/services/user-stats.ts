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

export async function fetchUserStats() {
  await validateAdminAccess();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, activeUsers, premiumUsers, suspendedUsers, newToday, flaggedAccounts] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountState: "ACTIVE" } }),
      prisma.user.count({
        where: {
          subscriptions: {
            some: {
              status: "ACTIVE",
            },
          },
        },
      }),
      prisma.user.count({ where: { accountState: "SUSPENDED" } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { flagged: true } }),
    ]);

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    suspendedUsers,
    newToday,
    flaggedAccounts,
  };
}

export async function fetchUserLifecycle() {
  await validateAdminAccess();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [newUsers, activeUsers, suspendedUsers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({
      where: {
        attempts: {
          some: {
            startedAt: { gte: sevenDaysAgo },
          },
        },
      },
    }),
    prisma.user.count({ where: { accountState: "SUSPENDED" } }),
  ]);

  // Total users
  const total = await prisma.user.count();
  const inactiveUsers = total - activeUsers - suspendedUsers;

  return {
    newUsers,
    activeUsers,
    inactiveUsers: inactiveUsers > 0 ? inactiveUsers : 0,
    suspendedUsers,
  };
}
