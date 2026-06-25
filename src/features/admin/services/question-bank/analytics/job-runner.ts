/**
 * QuizArena — Analytics Job Runner
 *
 * Single responsibility: execute analytics jobs with health recording.
 * Clean separation of scheduling from business logic.
 *
 * The cron route calls this runner.
 * The runner calls the aggregators.
 * Business logic is independently testable.
 */

import { prisma } from "@/lib/prisma";
import { processPendingStats, purgeOldAttemptLogs, reprocessAllStats } from "./usage-aggregator";

export type JobType = "USAGE_STATS" | "PURGE" | "REPROCESS_ALL";

export interface JobResult {
  jobId: string;
  jobType: string;
  status: "COMPLETED" | "FAILED";
  durationMs: number;
  rowsProcessed: number;
  error?: string;
}

/**
 * Run an analytics job with full health monitoring.
 * Creates an AnalyticsJob record tracking started/completed/failed/duration/rows.
 */
export async function runAnalyticsJob(
  jobType: JobType,
  options?: { batchSize?: number }
): Promise<JobResult> {
  const startTime = Date.now();

  // Create job record
  const job = await prisma.analyticsJob.create({
    data: {
      jobType,
      status: "STARTED",
    },
  });

  try {
    let rowsProcessed = 0;

    switch (jobType) {
      case "USAGE_STATS":
        rowsProcessed = await processPendingStats(options?.batchSize ?? 100);
        break;
      case "PURGE":
        rowsProcessed = await purgeOldAttemptLogs();
        break;
      case "REPROCESS_ALL":
        rowsProcessed = await reprocessAllStats();
        break;
    }

    const durationMs = Date.now() - startTime;

    await prisma.analyticsJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        durationMs,
        rowsProcessed,
      },
    });

    return {
      jobId: job.id,
      jobType,
      status: "COMPLETED",
      durationMs,
      rowsProcessed,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await prisma.analyticsJob.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        durationMs,
        errorMessage,
      },
    });

    return {
      jobId: job.id,
      jobType,
      status: "FAILED",
      durationMs,
      rowsProcessed: 0,
      error: errorMessage,
    };
  }
}
