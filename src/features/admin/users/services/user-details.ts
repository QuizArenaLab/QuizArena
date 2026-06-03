"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import { AccountState, UserRole } from "@/generated/prisma";
import { logModerationAction } from "@/features/super-admin/services/audit/index";

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

export async function fetchUserCoreDetails(userId: string) {
  await validateAdminAccess();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      examCategory: true,
      preparationLevel: true,
      dailyPracticeGoal: true,
      recommendationEngine: true,
      accountState: true,
      flagged: true,
      _count: {
        select: {
          attempts: true,
          leaderboardEntries: true,
          transactions: {
            where: { status: "COMPLETED" },
          },
        },
      },
      attempts: {
        orderBy: { startedAt: "desc" },
        take: 1,
        select: { startedAt: true },
      },
      leaderboardEntries: {
        orderBy: { rank: "asc" },
        take: 1,
        select: { rank: true },
      },
      subscriptions: {
        where: { status: "ACTIVE" },
        select: { plan: { select: { name: true } } },
      },
      targetedReports: {
        where: { status: { in: ["OPEN", "UNDER_REVIEW"] } },
        select: { id: true },
      },
      performanceProfile: {
        select: { longestStreak: true },
      },
      performanceSnapshot: {
        select: { percentile: true, currentRank: true },
      },
    },
  });

  if (!user) return null;

  return {
    identity: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt,
    },
    prepProfile: {
      targetExam: user.examCategory,
      difficultyLevel: user.preparationLevel,
      practiceGoal: user.dailyPracticeGoal,
      recommendationStatus: user.recommendationEngine ? "Enabled" : "Disabled",
    },
    competitionRecord: {
      competitionsPlayed: user._count.attempts,
      bestRank: user.leaderboardEntries.length > 0 ? user.leaderboardEntries[0].rank : null,
      currentRank: user.performanceSnapshot?.currentRank || null,
      bestPercentile: user.performanceSnapshot?.percentile || null,
      leaderboardHits: user._count.leaderboardEntries,
      highestStreak: user.performanceProfile?.longestStreak || 0,
    },
    subscription: {
      currentPlan: user.subscriptions.length > 0 ? user.subscriptions[0].plan.name : "Free",
      purchaseHistoryCount: user._count.transactions,
      activePasses: user.subscriptions.length,
    },
    riskSignals: {
      reportsReceived: user.targetedReports.length,
      isRestricted: user.flagged || user.accountState === "DEACTIVATED",
      isSuspended: user.accountState === "SUSPENDED" || user.accountState === "BANNED",
    },
    moderationSummary: {
      reportsReceived: user.targetedReports.length,
      warningsIssued: 0, // Simplified for MVP
      restrictionsApplied: user.flagged ? 1 : 0,
      appealsSubmitted: 0, // Simplified for MVP
    },
    lastActiveAt: user.attempts.length > 0 ? user.attempts[0].startedAt : null,
  };
}

export async function fetchUserActivityTimeline(userId: string) {
  await validateAdminAccess();

  // Create a timeline combining different events
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });

  const recentAttempts = await prisma.attempt.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    take: 5,
    select: { id: true, startedAt: true, score: true },
  });

  const timeline = [];

  if (user) {
    timeline.push({ type: 'JOINED', label: 'Joined Platform', timestamp: user.createdAt });
  }

  recentAttempts.forEach(attempt => {
    timeline.push({ 
      type: 'COMPETITION', 
      label: `Competition Completed (Score: ${attempt.score || 0})`, 
      timestamp: attempt.startedAt 
    });
  });

  // Sort newest first
  timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return timeline;
}

export async function fetchUserAuditLogs(userId: string) {
  await validateAdminAccess();

  const targetedAudits = await prisma.auditLog.findMany({
    where: { targetUserId: userId },
    orderBy: { createdAt: "desc" },
    take: 15,
    select: {
      action: true,
      createdAt: true,
      actor: { select: { name: true, username: true } },
    }
  });

  return targetedAudits.map(audit => ({
    action: audit.action,
    admin: audit.actor?.name || audit.actor?.username || "System",
    timestamp: audit.createdAt,
  }));
}

export interface AdminActionPayload {
  userId: string;
  action: "restrict" | "suspend" | "restore";
  reason: string;
  adminNotes?: string;
  duration?: string;
}

export async function performAdminAction(payload: AdminActionPayload) {
  const { userId, action, reason, adminNotes, duration } = payload;
  const session = await validateAdminAccess();
  const adminId = session.user.id;

  if (userId === adminId) {
    return { success: false, error: "Cannot perform action on yourself" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, accountState: true },
  });

  if (!targetUser) {
    return { success: false, error: "User not found" };
  }

  if (targetUser.role === UserRole.SUPER_ADMIN && (session.user.role as string) !== "SUPER_ADMIN") {
    return { success: false, error: "Cannot moderate super admin accounts" };
  }

  let newState: AccountState = targetUser.accountState;
  let flagged = false;
  let auditAction = "";

  if (action === "restrict") {
    flagged = true;
    auditAction = "USER_RESTRICTED";
  } else if (action === "suspend") {
    newState = "SUSPENDED";
    auditAction = "USER_SUSPENDED";
  } else if (action === "restore") {
    newState = "ACTIVE";
    flagged = false;
    auditAction = "USER_RESTORED";
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      accountState: newState,
      flagged,
    },
  });

  await logModerationAction(
    adminId, 
    userId, 
    auditAction, 
    reason || `Admin performed ${action} action`,
    {
      previousState: targetUser.accountState,
      newState,
      duration,
      adminNotes
    }
  );

  return { success: true };
}
