"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin } from "@/features/rbac/services/guards";
import type {
  LiveChallenge,
  ChallengeHealthState,
  OperationalAlert,
  LiveParticipant,
  AntiCheatStats,
  TimelineEvent,
  InfrastructureStatus,
  LiveOperationsDashboardData,
  AlertSeverity,
} from "@/types/live-operations";

// Helper to determine health state based on attempt stats
function calculateHealthState(
  failedCount: number,
  abandonedCount: number,
  violationCount: number
): ChallengeHealthState {
  const anomalies = failedCount + abandonedCount + (violationCount > 10 ? 1 : 0);
  if (anomalies > 15) return "CRITICAL";
  if (anomalies > 5) return "DEGRADED";
  if (anomalies > 0) return "WARNING";
  return "HEALTHY";
}

export async function getLiveChallenges(): Promise<LiveChallenge[]> {
  await requireAdmin("/dashboard");

  const challenges = await prisma.challenge.findMany({
    where: { status: "LIVE" },
    include: {
      attempts: {
        select: {
          status: true,
          totalViolations: true,
          isFlagged: true,
        },
      },
    },
    orderBy: { startsAt: "desc" },
  });

  return challenges.map((challenge) => {
    let active = 0;
    let completed = 0;
    let abandoned = 0;
    let totalViolations = 0;

    for (const attempt of challenge.attempts) {
      if (attempt.status === "IN_PROGRESS") active++;
      else if (attempt.status === "SUBMITTED" || attempt.status === "EVALUATED") completed++;
      else if (attempt.status === "ABANDONED") abandoned++;

      totalViolations += attempt.totalViolations;
    }

    return {
      id: challenge.id,
      title: challenge.title,
      slug: challenge.slug,
      difficulty: challenge.difficulty,
      status: challenge.status,
      startsAt: challenge.startsAt,
      endsAt: challenge.endsAt,
      durationInMinutes: challenge.durationInMinutes,
      activeParticipants: active,
      completedParticipants: completed,
      abandonedParticipants: abandoned,
      healthState: calculateHealthState(0, abandoned, totalViolations),
    };
  });
}

export async function getLiveParticipants(challengeId: string): Promise<LiveParticipant[]> {
  await requireAdmin("/dashboard");

  const attempts = await prisma.attempt.findMany({
    where: { challengeId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { startedAt: "desc" },
  });

  return attempts.map((a) => ({
    id: a.id,
    userId: a.userId,
    name: a.user.name || "Unknown User",
    status: a.status,
    startedAt: a.startedAt,
    submittedAt: a.submittedAt,
    score: a.score,
    totalViolations: a.totalViolations,
    isFlagged: a.isFlagged,
  }));
}

export async function getChallengeHealth(challengeId: string): Promise<ChallengeHealthState> {
  await requireAdmin("/dashboard");

  const attempts = await prisma.attempt.findMany({
    where: { challengeId },
    select: { status: true, totalViolations: true },
  });

  let abandoned = 0;
  let totalViolations = 0;
  for (const a of attempts) {
    if (a.status === "ABANDONED") abandoned++;
    totalViolations += a.totalViolations;
  }

  return calculateHealthState(0, abandoned, totalViolations);
}

export async function monitorSuspiciousActivity(challengeId?: string): Promise<AntiCheatStats> {
  await requireAdmin("/dashboard");

  const whereClause = challengeId ? { attempt: { challengeId } } : {};
  const attemptWhere = challengeId ? { challengeId } : {};

  const [logs, flaggedAttempts, tabSwitches, blurs, copies, rightClicks] = await Promise.all([
    prisma.antiCheatLog.findMany({
      where: whereClause,
      include: {
        attempt: {
          include: { user: { select: { name: true, id: true } } },
        },
      },
      orderBy: { reportedAt: "desc" },
      take: 50,
    }),
    prisma.attempt.count({ where: { ...attemptWhere, isFlagged: true } }),
    prisma.antiCheatLog.aggregate({
      _sum: { count: true },
      where: { ...whereClause, violationType: "TAB_SWITCH" },
    }),
    prisma.antiCheatLog.aggregate({
      _sum: { count: true },
      where: { ...whereClause, violationType: "WINDOW_BLUR" },
    }),
    prisma.antiCheatLog.aggregate({
      _sum: { count: true },
      where: { ...whereClause, violationType: "COPY_ATTEMPT" },
    }),
    prisma.antiCheatLog.aggregate({
      _sum: { count: true },
      where: { ...whereClause, violationType: "RIGHT_CLICK" },
    }),
  ]);

  return {
    tabSwitchCount: tabSwitches._sum.count || 0,
    blurCount: blurs._sum.count || 0,
    copyAttempts: copies._sum.count || 0,
    rightClicks: rightClicks._sum.count || 0,
    flaggedUsersCount: flaggedAttempts,
    recentViolations: logs.map((log) => ({
      id: log.id,
      userId: log.attempt.user.id,
      userName: log.attempt.user.name || "Unknown",
      violationType: log.violationType,
      reportedAt: log.reportedAt,
    })),
  };
}

export async function getOperationalAlerts(): Promise<OperationalAlert[]> {
  await requireAdmin("/dashboard");

  const alerts: OperationalAlert[] = [];
  let alertId = 1;
  const now = new Date();

  // Find suspended users (security anomaly)
  const flaggedAttempts = await prisma.attempt.count({ where: { isFlagged: true } });
  if (flaggedAttempts > 5) {
    alerts.push({
      id: `live-alert-${alertId++}`,
      title: "High Integrity Risk Detected",
      description: `Detected ${flaggedAttempts} flagged attempts. Check suspicious activity.`,
      severity: "WARNING",
      timestamp: now,
      source: "AntiCheatMonitor",
      resolved: false,
    });
  }

  // Detect mass disconnects/abandonments
  const abandonedAttempts = await prisma.attempt.count({
    where: {
      status: "ABANDONED",
      startedAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) }, // last hour
    },
  });

  if (abandonedAttempts > 10) {
    alerts.push({
      id: `live-alert-${alertId++}`,
      title: "Abnormal Abandonment Rate",
      description: `${abandonedAttempts} attempts were abandoned in the last hour. Verify infrastructure health.`,
      severity: abandonedAttempts > 20 ? "CRITICAL" : "WARNING",
      timestamp: now,
      source: "ParticipationMonitor",
      resolved: false,
    });
  }

  // If everything is fine
  if (alerts.length === 0) {
    alerts.push({
      id: `live-alert-${alertId++}`,
      title: "System Nominal",
      description: "No live operational anomalies detected.",
      severity: "INFO",
      timestamp: now,
      source: "LiveMonitor",
      resolved: true,
    });
  }

  return alerts;
}

export async function getLiveActivityTimeline(): Promise<TimelineEvent[]> {
  await requireAdmin("/dashboard");

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const events: TimelineEvent[] = [];

  const [recentAttempts, recentLogs] = await Promise.all([
    prisma.attempt.findMany({
      where: { startedAt: { gte: hourAgo } },
      include: { challenge: { select: { title: true } }, user: { select: { name: true } } },
      orderBy: { startedAt: "desc" },
      take: 20,
    }),
    prisma.antiCheatLog.findMany({
      where: { reportedAt: { gte: hourAgo } },
      include: {
        attempt: {
          include: { challenge: { select: { title: true } }, user: { select: { name: true } } },
        },
      },
      orderBy: { reportedAt: "desc" },
      take: 20,
    }),
  ]);

  for (const a of recentAttempts) {
    events.push({
      id: `start-${a.id}`,
      challengeId: a.challengeId,
      type: "START",
      title: "Challenge Started",
      description: `${a.user.name || "User"} started "${a.challenge.title}"`,
      timestamp: a.startedAt,
      severity: "INFO",
    });

    if (a.submittedAt) {
      events.push({
        id: `submit-${a.id}`,
        challengeId: a.challengeId,
        type: "SUBMISSION",
        title: "Challenge Submitted",
        description: `${a.user.name || "User"} submitted "${a.challenge.title}"`,
        timestamp: a.submittedAt,
        severity: "INFO",
      });
    }
  }

  for (const log of recentLogs) {
    events.push({
      id: `viol-${log.id}`,
      challengeId: log.attempt.challengeId,
      type: "VIOLATION",
      title: "Integrity Violation",
      description: `${log.attempt.user.name || "User"} triggered a ${log.violationType} violation`,
      timestamp: log.reportedAt,
      severity: "WARNING",
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
}

// ─── Governance Actions (SUPER_ADMIN precedence) ──────────────

export async function pauseChallengeVisibility(challengeId: string) {
  // SUPER_ADMIN enforced action
  await requireSuperAdmin("/dashboard");

  await prisma.challenge.update({
    where: { id: challengeId },
    data: { visibility: "PRIVATE" },
  });

  return { success: true, message: "Challenge visibility paused (set to PRIVATE)." };
}

export async function disableChallengeAccess(challengeId: string) {
  // SUPER_ADMIN enforced action
  await requireSuperAdmin("/dashboard");

  await prisma.challenge.update({
    where: { id: challengeId },
    data: { status: "ARCHIVED" }, // Prevents further attempts completely
  });

  return { success: true, message: "Challenge access disabled (ARCHIVED)." };
}

export async function getLiveOperationsDashboardData(): Promise<LiveOperationsDashboardData> {
  await requireAdmin("/dashboard");

  const [liveChallenges, alerts, recentActivity] = await Promise.all([
    getLiveChallenges(),
    getOperationalAlerts(),
    getLiveActivityTimeline(),
  ]);

  const infrastructureStatus: InfrastructureStatus = {
    timerSyncHealth: "HEALTHY",
    autosaveHealth: "HEALTHY",
    submissionPipelineHealth: "HEALTHY",
    lastCheckTime: new Date(),
  };

  return {
    liveChallenges,
    alerts,
    infrastructureStatus,
    recentActivity,
    lastUpdated: new Date(),
  };
}
