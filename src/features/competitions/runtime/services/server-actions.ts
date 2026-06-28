"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function initializeRuntime(slug: string) {
  // handled heavily by the session.service.ts already, this might just be a proxy or left in session.service
}

export async function heartbeat(sessionId: string) {
  try {
    await prisma.competitionSession.update({
      where: { id: sessionId },
      data: {
        // We could track last heartbeat in a real DB or Redis, skipping for now
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed heartbeat" };
  }
}

export async function syncAnswers(sessionId: string, payload: { answers: any[] }) {
  try {
    const session = await prisma.competitionSession.findUnique({
      where: { id: sessionId },
      select: { status: true },
    });

    if (!session) return { success: false, error: "Session not found." };
    if (session.status === "SUBMITTED" || session.status === "EXPIRED") {
      return { success: false, error: "Session cannot accept changes." };
    }

    const { answers } = payload;

    // We execute upsert in parallel for each answer
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
            selectedOptionId: ans.selectedOptionId,
            isVisited: ans.isVisited,
            isMarkedForReview: ans.isMarkedForReview,
            answeredAt: ans.answeredAt,
          },
          create: {
            sessionId,
            questionId: ans.questionId,
            selectedOptionId: ans.selectedOptionId,
            isVisited: ans.isVisited,
            isMarkedForReview: ans.isMarkedForReview,
            answeredAt: ans.answeredAt,
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

export async function recoverSession(sessionId: string) {
  return { success: true };
}

export async function lockSession(sessionId: string) {
  return { success: true };
}

export async function submitSession(sessionId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const session = await tx.competitionSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) throw new Error("Session not found");
      if (session.status === "SUBMITTED") {
        const existingAttempt = await tx.competitionAttempt.findUnique({ where: { sessionId } });
        return { success: true, data: { attemptId: existingAttempt?.id } };
      }

      await tx.competitionSession.update({
        where: { id: sessionId },
        data: { status: "SUBMITTED" },
      });

      const attempt = await tx.competitionAttempt.create({
        data: {
          sessionId,
          competitionId: session.competitionId,
          userId: session.userId,
        },
      });

      return { success: true, data: { attemptId: attempt.id } };
    });
  } catch (error) {
    console.error("[submitSession] Error:", error);
    return { success: false, error: "Failed to submit" };
  }
}

export async function terminateSession(sessionId: string) {
  return { success: true };
}
