/**
 * QuizArena — Question Analytics Cron Route
 *
 * Thin scheduler endpoint — calls job runner, returns results.
 * Protected by API key header.
 *
 * Compatible with:
 * - Vercel Cron
 * - External schedulers
 * - Manual trigger
 *
 * Future-ready for BullMQ/Inngest (just swap the caller).
 */

import { NextResponse } from "next/server";
import { runAnalyticsJob, type JobResult } from "@/features/admin/services/question-bank/analytics/job-runner";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Validate API key
  if (CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const results: JobResult[] = [];

  // Run usage stats processing
  const statsResult = await runAnalyticsJob("USAGE_STATS", { batchSize: 200 });
  results.push(statsResult);

  // Run purge if it's been a while (always safe to run)
  const purgeResult = await runAnalyticsJob("PURGE");
  results.push(purgeResult);

  const allSucceeded = results.every((r) => r.status === "COMPLETED");

  return NextResponse.json(
    {
      success: allSucceeded,
      jobs: results,
      processedAt: new Date().toISOString(),
    },
    { status: allSucceeded ? 200 : 207 }
  );
}
