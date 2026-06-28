"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { SessionResult } from "@/types/competition-experience";

/**
 * Submit the competition session.
 *
 * Flow:
 * 1. Validate session state.
 * 2. In a transaction, mark session as SUBMITTED.
 * 3. Create the immutable CompetitionAttempt record.
 * 4. (Future) Emit event to Evaluation Engine queue.
 */
export async function submitSession(
  sessionId: string
): Promise<SessionResult<{ attemptId: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  const compSession = await prisma.competitionSession.findUnique({
    where: { id: sessionId },
  });

  if (!compSession) {
    return { success: false, error: "Session not found." };
  }

  if (compSession.userId !== userId) {
    return { success: false, error: "Unauthorized session access." };
  }

  if (compSession.status === "SUBMITTED") {
    // Already submitted, just return the attemptId if it exists
    const attempt = await prisma.competitionAttempt.findUnique({
      where: { sessionId },
    });
    if (attempt) {
      return { success: true, data: { attemptId: attempt.id } };
    }
  }

  if (compSession.status !== "IN_PROGRESS" && compSession.status !== "EXPIRED") {
    return { success: false, error: `Cannot submit session in state: ${compSession.status}` };
  }

  try {
    const attempt = await prisma.$transaction(async (tx) => {
      // Mark session as SUBMITTED
      await tx.competitionSession.update({
        where: { id: sessionId },
        data: { status: "SUBMITTED" },
      });

      // Generate the immutable CompetitionAttempt
      const newAttempt = await tx.competitionAttempt.create({
        data: {
          sessionId,
          competitionId: compSession.competitionId,
          userId,
        },
      });

      return newAttempt;
    });

    // FUTURE: Emit Domain Event `CompetitionSubmitted` for Evaluation Engine to pick up.
    // e.g. eventBus.emit('CompetitionSubmitted', { attemptId: attempt.id });

    return { success: true, data: { attemptId: attempt.id } };
  } catch (error) {
    console.error("[Workspace Submission Error]", error);
    return { success: false, error: "Failed to submit session." };
  }
}
