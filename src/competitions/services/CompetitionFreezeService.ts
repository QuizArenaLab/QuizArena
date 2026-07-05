import { prisma } from "@/lib/prisma";
import { CompetitionLifecycle } from "@/generated/prisma";

export class CompetitionFreezeService {
  /**
   * Freezes a competition draft by locking its schema and changing its lifecycle state
   * from DRAFT to READY (or SCHEDULED if a future start date is set).
   * 
   * This is an immutable operation for the schema (sections/questions).
   */
  async freezeCompetition(competitionId: string, userId: string) {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new Error("Competition not found.");
    }

    if (competition.lifecycleState !== CompetitionLifecycle.DRAFT) {
      throw new Error("Only DRAFT competitions can be frozen.");
    }

    // Determine the next state based on scheduling
    let nextState: CompetitionLifecycle = CompetitionLifecycle.READY;
    if (competition.startsAt && new Date(competition.startsAt) > new Date()) {
      nextState = CompetitionLifecycle.SCHEDULED;
    } else if (competition.startsAt && new Date(competition.startsAt) <= new Date()) {
      nextState = CompetitionLifecycle.LIVE;
    }

    const updatedCompetition = await prisma.competition.update({
      where: { id: competitionId },
      data: {
        lifecycleState: nextState,
        updatedById: userId,
      },
    });

    return updatedCompetition;
  }
}
