"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import { $Enums } from "@/generated/prisma";

async function validateSuperAdminAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }

  const userRole = (session.user.role as string) || "USER";

  if (!hasMinimumRole(userRole, ROLE.SUPER_ADMIN)) {
    throw new Error("Access denied: Super Admin role required");
  }

  return session;
}

export type RoleType = $Enums.UserRole;

export interface RoleChangeInput {
  targetUserId: string;
  newRole: RoleType;
  reason?: string;
}

export interface RoleOverviewStats {
  totalUsers: number;
  totalModerators: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  recentRoleChanges: number;
}

export interface RoleChangeAuditEntry {
  id: string;
  targetUser: { id: string; name: string | null; username: string | null; email: string | null };
  changedBy: { id: string; name: string | null };
  previousRole: RoleType;
  newRole: RoleType;
  reason: string | null;
  changedAt: Date;
}

export interface PromotableUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: RoleType;
  createdAt: Date;
}

const ROLE_HIERARCHY: Record<RoleType, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export async function getRoleOverviewStats(): Promise<RoleOverviewStats> {
  await validateSuperAdminAccess();

  const [totalUsers, moderators, admins, superAdmins, recentChanges] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "MODERATOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "SUPER_ADMIN" } }),
    prisma.roleChangeAudit.count({
      where: { changedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return {
    totalUsers,
    totalModerators: moderators,
    totalAdmins: admins,
    totalSuperAdmins: superAdmins,
    recentRoleChanges: recentChanges,
  };
}

export async function getPromotableUsers(): Promise<{
  users: PromotableUser[];
  moderators: PromotableUser[];
  admins: PromotableUser[];
}> {
  await validateSuperAdminAccess();

  const [users, moderators, admins] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.user.findMany({
      where: { role: "MODERATOR" },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return { users, moderators, admins };
}

export async function getRoleChangeHistory(limit: number = 50): Promise<RoleChangeAuditEntry[]> {
  await validateSuperAdminAccess();

  const audits = await prisma.roleChangeAudit.findMany({
    orderBy: { changedAt: "desc" },
    take: limit,
    select: {
      id: true,
      previousRole: true,
      newRole: true,
      reason: true,
      changedAt: true,
      targetUser: { select: { id: true, name: true, username: true, email: true } },
      changedBy: { select: { id: true, name: true } },
    },
  });

  return audits.map((audit) => ({
    id: audit.id,
    targetUser: audit.targetUser,
    changedBy: audit.changedBy,
    previousRole: audit.previousRole,
    newRole: audit.newRole,
    reason: audit.reason,
    changedAt: audit.changedAt,
  }));
}

export async function changeUserRole(
  input: RoleChangeInput
): Promise<{ success: boolean; error?: string }> {
  const session = await validateSuperAdminAccess();
  const adminId = session.user.id;

  if (input.targetUserId === adminId) {
    return { success: false, error: "Cannot change your own role" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: input.targetUserId },
    select: { role: true, name: true },
  });

  if (!targetUser) {
    return { success: false, error: "User not found" };
  }

  const adminRole = session.user.role as string;
  if (targetUser.role === "SUPER_ADMIN" && adminRole !== "SUPER_ADMIN") {
    return { success: false, error: "Only Super Admins can modify Super Admin roles" };
  }

  const currentLevel = ROLE_HIERARCHY[targetUser.role as RoleType] ?? 0;
  const newLevel = ROLE_HIERARCHY[input.newRole] ?? 0;

  if (newLevel >= currentLevel) {
    const maxPromotion = currentLevel + 1;
    let allowedRole: RoleType = "USER";

    if (maxPromotion === 1) {
      allowedRole = "MODERATOR";
    } else if (maxPromotion === 2) {
      allowedRole = "ADMIN";
    } else if (maxPromotion >= 3) {
      allowedRole = "SUPER_ADMIN";
    }

    if (input.newRole !== allowedRole && adminRole !== "SUPER_ADMIN") {
      return {
        success: false,
        error: `Cannot promote beyond ${allowedRole}. Only Super Admin can assign higher roles.`,
      };
    }
  }

  const superAdminCount = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
  if (
    targetUser.role === "SUPER_ADMIN" &&
    input.newRole !== "SUPER_ADMIN" &&
    superAdminCount <= 1
  ) {
    return { success: false, error: "Cannot demote the last Super Admin" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: input.targetUserId },
      data: { role: input.newRole },
    }),
    prisma.roleChangeAudit.create({
      data: {
        targetUserId: input.targetUserId,
        changedById: adminId,
        previousRole: targetUser.role as $Enums.UserRole,
        newRole: input.newRole,
        reason: input.reason,
      },
    }),
  ]);

  return { success: true };
}

export async function promoteToModerator(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "MODERATOR", reason });
}

export async function promoteToAdmin(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "ADMIN", reason });
}

export async function demoteToModerator(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "MODERATOR", reason });
}

export async function demoteToUser(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "USER", reason });
}

export async function assignSuperAdmin(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "SUPER_ADMIN", reason });
}

export async function revokeSuperAdmin(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  return changeUserRole({ targetUserId: userId, newRole: "ADMIN", reason });
}
