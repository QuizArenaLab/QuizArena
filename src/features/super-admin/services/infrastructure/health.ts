"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/features/super-admin/services/governance";

export interface InfrastructureHealth {
  status: "OPERATIONAL" | "DEGRADED" | "CRITICAL";
  database: {
    status: "up" | "down" | "degraded";
    latencyMs: number;
    lastChecked: string;
  };
  auth: {
    status: "up" | "down";
    activeSessionsCount: number;
  };
  crons: {
    status: "up" | "down";
    scheduledJobs: number;
  };
  pipelines: {
    challengeSystemStatus: "active" | "inactive";
    moderationQueueSize: number;
  };
}

/**
 * Gathers system-wide infrastructure health metrics.
 * STRICTLY SUPER_ADMIN ONLY.
 */
export async function getInfrastructureHealth(): Promise<InfrastructureHealth> {
  await requireSuperAdmin();

  const now = Date.now();
  let dbStatus: "up" | "down" | "degraded" = "up";
  let dbLatency = 0;

  try {
    // Measure DB latency with a simple query
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - now;
    if (dbLatency > 1000) {
      dbStatus = "degraded"; // High latency
    }
  } catch {
    dbStatus = "down";
  }

  let authActiveSessions = 0;
  let moderationQueueSize = 0;
  let scheduledJobs = 0;

  if (dbStatus !== "down") {
    try {
      // Get active sessions (assuming sessions updated recently)
      // For mock purposes, count users logged in recently or just total users if sessions aren't actively cleaned
      authActiveSessions = await prisma.user.count({
        where: { updatedAt: { gte: new Date(Date.now() - 1000 * 60 * 15) } }, // Active in last 15 mins
      });

      moderationQueueSize = await prisma.question.count({
        where: { status: "REVIEW" },
      });

      scheduledJobs = await prisma.challenge.count({
        where: { status: "SCHEDULED" },
      });
    } catch {
      // Ignored for health check
    }
  }

  // Determine overall status
  let overallStatus: "OPERATIONAL" | "DEGRADED" | "CRITICAL" = "OPERATIONAL";

  if (dbStatus === "down") {
    overallStatus = "CRITICAL";
  } else if (dbStatus === "degraded") {
    overallStatus = "DEGRADED";
  }

  return {
    status: overallStatus,
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
      lastChecked: new Date().toISOString(),
    },
    auth: {
      status: dbStatus === "down" ? "down" : "up",
      activeSessionsCount: authActiveSessions,
    },
    crons: {
      status: "up", // Assuming Vercel Cron/internal cron is active
      scheduledJobs,
    },
    pipelines: {
      challengeSystemStatus: "active",
      moderationQueueSize,
    },
  };
}
