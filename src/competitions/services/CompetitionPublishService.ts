import { prisma } from "@/lib/prisma";
import { CompetitionLifecycle } from "@/generated/prisma";
import { EnvironmentService } from "@/platform/env/EnvironmentService";

export interface PublishMetadata {
  shareableLink: string;
  isPublic: boolean;
  indexedData: {
    title: string;
    description: string;
    difficulty: string;
    exam: string | null;
    tags: string[];
  };
}

export class CompetitionPublishService {
  /**
   * Finalizes the publishing of a competition and prepares metadata for discovery/sharing.
   * Ensures the competition is in a valid state for publishing (READY, SCHEDULED, LIVE).
   */
  async publishCompetition(competitionId: string): Promise<PublishMetadata> {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new Error("Competition not found.");
    }

    const validStates: CompetitionLifecycle[] = [
      CompetitionLifecycle.READY,
      CompetitionLifecycle.SCHEDULED,
      CompetitionLifecycle.LIVE,
    ];

    if (!validStates.includes(competition.lifecycleState)) {
      throw new Error(
        `Competition cannot be published from state: ${competition.lifecycleState}. Freeze the competition first.`
      );
    }

    // Generate Shareable Link
    const baseUrl = EnvironmentService.getCanonicalOrigin();
    const shareableLink = `${baseUrl}/competitions/${competition.slug}`;

    // Prepare Discovery Metadata (Mock Search Index Integration)
    const indexedData = {
      title: competition.title,
      description: competition.description || "",
      difficulty: competition.difficulty,
      exam: competition.exam,
      tags: [competition.competitionType, competition.difficulty].map((t) => t.toLowerCase()),
    };

    return {
      shareableLink,
      isPublic: competition.visibility === "PUBLIC",
      indexedData,
    };
  }
}
