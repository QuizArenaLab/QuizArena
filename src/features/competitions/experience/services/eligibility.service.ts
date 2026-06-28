"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { SessionResult } from "@/types/competition-experience";

/**
 * Validates whether a user can start or join a competition.
 * Checks LIVE status, active windows, and prevents duplicate active sessions.
 */
export async function checkEligibility(
  competitionSlug: string
): Promise<SessionResult<{ competitionId: string }>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  // 1. Fetch competition by slug
  const competition = await prisma.competition.findUnique({
    where: { slug: competitionSlug },
    include: {
      schedule: true,
      eligibility: true,
    },
  });

  if (!competition) {
    return { success: false, error: "Competition not found" };
  }

  // 2. Status must be LIVE
  if (competition.status !== "LIVE") {
    return { success: false, error: "This competition is not currently live." };
  }

  // 3. Time bounds (if explicitly scheduled)
  const now = new Date();
  if (competition.startsAt && now < competition.startsAt) {
    return { success: false, error: "This competition has not started yet." };
  }
  if (competition.endsAt && now > competition.endsAt) {
    return { success: false, error: "This competition has already ended." };
  }

  // 4. Duplicate Session Check (Only ONE active session allowed)
  // If user has an active session, it's fine, we will just resume it in the initialization flow,
  // but if they have already SUBMITTED or EXPIRED, they cannot take it again (unless allowRetake is true, which we skip for Phase 5 MVP).
  const existingSession = await prisma.competitionSession.findUnique({
    where: {
      userId_competitionId: {
        userId,
        competitionId: competition.id,
      },
    },
  });

  if (existingSession) {
    if (
      existingSession.status === "SUBMITTED" ||
      existingSession.status === "EXPIRED" ||
      existingSession.status === "ABANDONED"
    ) {
      return { success: false, error: "You have already completed this competition." };
    }
    // If INITIALIZING, READY, IN_PROGRESS, PAUSED, SUBMITTING -> allow to proceed to resume.
  }

  return { success: true, data: { competitionId: competition.id } };
}
