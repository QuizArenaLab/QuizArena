"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { SessionResult, SyncPayload } from "@/types/competition-experience";

/**
 * Synchronize a queue of mutations to the server.
 * Ensures the session is still active and valid.
 * Does NOT evaluate correctness.
 */
export async function syncAnswers(
  sessionId: string,
  payload: SyncPayload
): Promise<SessionResult<{ processed: number }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const compSession = await prisma.competitionSession.findUnique({
    where: { id: sessionId },
  });

  if (!compSession) {
    return { success: false, error: "Session not found." };
  }

  if (compSession.userId !== session.user.id) {
    return { success: false, error: "Unauthorized session access." };
  }

  // Check state and expiry
  if (compSession.status !== "IN_PROGRESS") {
    return { success: false, error: "Session is not in progress." };
  }

  if (compSession.expiresAt && new Date() >= compSession.expiresAt) {
    // If expired, the sync should fail so the client triggers a submit, or we auto-submit here.
    // For pure Experience Engine, we just reject the sync and let the submission flow handle it.
    return { success: false, error: "Time has expired." };
  }

  if (!payload.answers || payload.answers.length === 0) {
    return { success: true, data: { processed: 0 } };
  }

  // Execute bulk upsert in a transaction
  const upserts = payload.answers.map((ans) => {
    return prisma.competitionSessionAnswer.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId: ans.questionId,
        },
      },
      update: {
        selectedOptionId: ans.selectedOptionId,
        isVisited: ans.isVisited,
        isMarkedForReview: ans.isMarkedForReview,
        answeredAt: ans.answeredAt ? new Date(ans.answeredAt) : new Date(),
      },
      create: {
        sessionId,
        questionId: ans.questionId,
        selectedOptionId: ans.selectedOptionId,
        isVisited: ans.isVisited,
        isMarkedForReview: ans.isMarkedForReview,
        answeredAt: ans.answeredAt ? new Date(ans.answeredAt) : new Date(),
      },
    });
  });

  try {
    await prisma.$transaction(upserts);
    return { success: true, data: { processed: upserts.length } };
  } catch (error) {
    console.error("[Workspace Sync Error]", error);
    return { success: false, error: "Failed to synchronize answers." };
  }
}
