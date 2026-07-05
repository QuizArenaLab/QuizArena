import { prisma } from "@/lib/prisma";
import { CompetitionLifecycle } from "@/generated/prisma";

export class CompetitionOperationsService {
  /**
   * Updates the lifecycle state of a competition for operational purposes 
   * (e.g. Force Pause, Resume, End Early).
   */
  async updateLifecycleState(competitionId: string, newState: CompetitionLifecycle, userId: string) {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new Error("Competition not found.");
    }

    // Typical operational transitions:
    // LIVE -> PAUSED
    // PAUSED -> LIVE
    // LIVE -> COMPLETED
    // SCHEDULED -> LIVE (Force start)
    // SCHEDULED -> CANCELLED

    const validTransitions: Record<string, CompetitionLifecycle[]> = {
      [CompetitionLifecycle.SCHEDULED]: [CompetitionLifecycle.LIVE, CompetitionLifecycle.CANCELLED],
      [CompetitionLifecycle.LIVE]: [CompetitionLifecycle.PAUSED, CompetitionLifecycle.COMPLETED],
      [CompetitionLifecycle.PAUSED]: [CompetitionLifecycle.LIVE, CompetitionLifecycle.COMPLETED],
    };

    const allowed = validTransitions[competition.lifecycleState] || [];
    
    if (!allowed.includes(newState)) {
      throw new Error(`Cannot transition from ${competition.lifecycleState} to ${newState}.`);
    }

    const updated = await prisma.competition.update({
      where: { id: competitionId },
      data: {
        lifecycleState: newState,
        updatedById: userId,
      },
    });

    return updated;
  }
}
