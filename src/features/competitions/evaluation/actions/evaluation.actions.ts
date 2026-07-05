"use server";

import { EvaluationPipeline } from "../pipeline/EvaluationPipeline";
import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { apiRateLimiter } from "@/lib/rate-limiter";

export async function processEvaluation(submissionRecordId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;
    
    const limit = apiRateLimiter.checkAndRegister(userId);
    if (limit.isLimited) {
      return { success: false, error: "Rate limit exceeded. Please try again later." };
    }

    const record = await prisma.submissionRecord.findUnique({
      where: { id: submissionRecordId },
      select: { userId: true }
    });

    if (!record) {
      return { success: false, error: "Submission record not found" };
    }

    if (record.userId !== userId) {
      return { success: false, error: "Unauthorized access to submission record" };
    }

    const result = await EvaluationPipeline.evaluate(submissionRecordId);
    return { success: true, data: { resultId: result.id } };
  } catch (error: any) {
    console.error("[processEvaluation] Error:", error);
    return { success: false, error: error.message || "Failed to process evaluation" };
  }
}
