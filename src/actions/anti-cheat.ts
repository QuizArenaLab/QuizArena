"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { ViolationType } from "@/types/challenge";

/** Violation thresholds */
const VIOLATION_WARNING_THRESHOLD = 3;
const VIOLATION_CRITICAL_THRESHOLD = 6;
const VIOLATION_FLAG_THRESHOLD = 10;

/**
 * Report anti-cheat violations from the client.
 * Called periodically (every 30s) or on attempt submission.
 *
 * Client detects violations (tab switch, blur, copy, right-click).
 * Server persists and aggregates them for admin review.
 *
 * IMPORTANT: Client-side detection is UX only. These records are
 * for auditing — they do NOT auto-penalize scores in MVP.
 */
export async function reportViolations(
  attemptId: string,
  violations: { type: ViolationType; count: number; timestamps: number[] }[]
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify the attempt belongs to this user and is active
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
  });

  if (!attempt) {
    return { success: false, error: "Attempt not found or not active" };
  }

  let totalNewViolations = 0;

  for (const violation of violations) {
    if (violation.count <= 0) continue;

    // Upsert violation record — accumulate counts
    await prisma.antiCheatLog.upsert({
      where: {
        attemptId_violationType: {
          attemptId,
          violationType: violation.type,
        },
      },
      update: {
        count: { increment: violation.count },
        metadata: {
          timestamps: violation.timestamps,
        },
        reportedAt: new Date(),
      },
      create: {
        attemptId,
        violationType: violation.type,
        count: violation.count,
        metadata: {
          timestamps: violation.timestamps,
        },
      },
    });

    totalNewViolations += violation.count;
  }

  // Update total violations on the attempt
  const updatedAttempt = await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      totalViolations: { increment: totalNewViolations },
      // Flag attempt if threshold exceeded
      isFlagged: attempt.totalViolations + totalNewViolations >= VIOLATION_FLAG_THRESHOLD,
    },
    select: {
      totalViolations: true,
      isFlagged: true,
    },
  });

  // Determine warning level to send back to client
  let warningLevel: "none" | "warning" | "critical" = "none";
  if (updatedAttempt.totalViolations >= VIOLATION_CRITICAL_THRESHOLD) {
    warningLevel = "critical";
  } else if (updatedAttempt.totalViolations >= VIOLATION_WARNING_THRESHOLD) {
    warningLevel = "warning";
  }

  return {
    success: true,
    totalViolations: updatedAttempt.totalViolations,
    isFlagged: updatedAttempt.isFlagged,
    warningLevel,
  };
}

/**
 * Get violation summary for an attempt (admin view).
 */
export async function getAttemptViolations(attemptId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Check if user is admin/moderator (basic check)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (
    !user ||
    (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "MODERATOR")
  ) {
    return null;
  }

  const violations = await prisma.antiCheatLog.findMany({
    where: { attemptId },
    orderBy: { reportedAt: "desc" },
  });

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: {
      totalViolations: true,
      isFlagged: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  });

  return {
    violations,
    totalViolations: attempt?.totalViolations || 0,
    isFlagged: attempt?.isFlagged || false,
    user: attempt?.user || null,
  };
}

/**
 * Get all flagged attempts for admin review.
 */
export async function getFlaggedAttempts(page: number = 1, pageSize: number = 20) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }

  const skip = (page - 1) * pageSize;

  const [attempts, totalCount] = await Promise.all([
    prisma.attempt.findMany({
      where: { isFlagged: true },
      orderBy: { totalViolations: "desc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        challenge: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        antiCheatLogs: true,
      },
    }),
    prisma.attempt.count({ where: { isFlagged: true } }),
  ]);

  return {
    attempts,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
