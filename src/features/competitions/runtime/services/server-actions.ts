"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { auth } from "@/auth/auth";
import { z } from "zod";
import { apiRateLimiter } from "@/lib/rate-limiter";

const SyncAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedOptionId: z.string().nullable().optional(),
      isVisited: z.boolean(),
      isMarkedForReview: z.boolean(),
      answeredAt: z.string().datetime().optional().nullable(),
    })
  ),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  
  const userId = session.user.id;
  const limit = apiRateLimiter.checkAndRegister(userId);
  if (limit.isLimited) {
    throw new Error("Rate limit exceeded. Please slow down.");
  }

  return userId;
}

export async function heartbeat(sessionId: string) {
  try {
    const userId = await requireAuth();
    
    // Ownership check
    const session = await prisma.competitionSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });
    
    if (!session || session.userId !== userId) {
      return { success: false, error: "Unauthorized access to session" };
    }

    await prisma.competitionSession.update({
      where: { id: sessionId },
      data: {
        lastHeartbeatAt: new Date(),
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed heartbeat" };
  }
}

export async function syncAnswers(sessionId: string, payload: { answers: any[] }) {
  try {
    const userId = await requireAuth();

    const parseResult = SyncAnswersSchema.safeParse(payload);
    if (!parseResult.success) {
      return { success: false, error: "Invalid payload format" };
    }

    const session = await prisma.competitionSession.findUnique({
      where: { id: sessionId },
      select: { status: true, userId: true },
    });

    if (!session) return { success: false, error: "Session not found." };
    if (session.userId !== userId) return { success: false, error: "Unauthorized access to session" };
    if (session.status === "SUBMITTED" || session.status === "EXPIRED") {
      return { success: false, error: "Session cannot accept changes." };
    }

    const { answers } = parseResult.data;

    // Execute upsert in parallel for each answer
    await Promise.all(
      answers.map((ans) =>
        prisma.competitionSessionAnswer.upsert({
          where: {
            sessionId_questionId: {
              sessionId,
              questionId: ans.questionId,
            },
          },
          update: {
            selectedOptionId: ans.selectedOptionId ?? null,
            isVisited: ans.isVisited,
            isMarkedForReview: ans.isMarkedForReview,
            answeredAt: ans.answeredAt ? new Date(ans.answeredAt) : undefined,
          },
          create: {
            sessionId,
            questionId: ans.questionId,
            selectedOptionId: ans.selectedOptionId ?? null,
            isVisited: ans.isVisited,
            isMarkedForReview: ans.isMarkedForReview,
            answeredAt: ans.answeredAt ? new Date(ans.answeredAt) : undefined,
          },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("[syncAnswers] Error:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function submitSession(sessionId: string) {
  try {
    const userId = await requireAuth();

    return await prisma.$transaction(async (tx) => {
      const session = await tx.competitionSession.findUnique({
        where: { id: sessionId },
        include: { answers: true }
      });

      if (!session) throw new Error("Session not found");
      if (session.userId !== userId) throw new Error("Unauthorized access to session");

      if (session.status === "SUBMITTED") {
        const existingAttempt = await tx.competitionAttempt.findUnique({ 
          where: { sessionId },
          include: { submissionRecord: true } 
        });
        return { success: true, data: { attemptId: existingAttempt?.id, submissionRecordId: existingAttempt?.submissionRecord?.id } };
      }

      // Generate Immutable Snapshot of Answers & Timing
      const evaluationSnapshot = {
        questionOrder: session.questionOrder,
        optionOrder: session.optionOrder,
        answers: session.answers.map(a => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          answeredAt: a.answeredAt,
          isMarkedForReview: a.isMarkedForReview
        })),
        submittedAt: new Date().toISOString(),
      };

      const timeTakenInSeconds = Math.floor(
        (new Date().getTime() - session.startedAt.getTime()) / 1000
      );

      await tx.competitionSession.update({
        where: { id: sessionId },
        data: { status: "SUBMITTED" },
      });

      // 1. Create or update the Attempt
      const attempt = await tx.competitionAttempt.upsert({
        where: { sessionId },
        update: { timeTakenInSeconds },
        create: {
          sessionId,
          competitionId: session.competitionId,
          userId: session.userId,
          timeTakenInSeconds,
        },
      });

      // 2. Create the immutable SubmissionRecord
      const submissionRecord = await tx.submissionRecord.create({
        data: {
          attemptId: attempt.id,
          userId: session.userId,
          evaluationSnapshot,
          manifests: {
            schemaVersion: "1.0",
            runtimeVersion: "1.0",
            generatedAt: new Date().toISOString()
          },
          hashes: {
            // MVP Hash mock
            payloadHash: "sha256-mock-hash"
          }
        },
      });

      return { success: true, data: { attemptId: attempt.id, submissionRecordId: submissionRecord.id } };
    });
  } catch (error) {
    console.error("[submitSession] Error:", error);
    return { success: false, error: "Failed to submit" };
  }
}
