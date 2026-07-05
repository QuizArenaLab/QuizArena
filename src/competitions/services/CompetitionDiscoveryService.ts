import { prisma } from "@/lib/prisma";
import { CompetitionLifecycle } from "@/generated/prisma";

export class CompetitionDiscoveryService {
  /**
   * Fetch all competitions available to candidates with cursor pagination
   */
  async getDiscoverableCompetitions(filters?: {
    category?: string;
    difficulty?: string;
    status?: CompetitionLifecycle;
    cursor?: string;
    limit?: number;
  }) {
    const whereClause: any = {
      lifecycleState: {
        in: ["SCHEDULED", "LIVE", "COMPLETED"] as CompetitionLifecycle[],
      },
    };

    if (filters?.status) {
      whereClause.lifecycleState = filters.status;
    }

    if (filters?.category) whereClause.exam = filters.category;
    if (filters?.difficulty) whereClause.difficulty = filters.difficulty;

    const limit = filters?.limit ?? 12;

    const queryArgs: any = {
      where: whereClause,
      take: limit + 1, // Fetch one extra to determine if there's a next page
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        lifecycleState: true,
        durationMinutes: true,
        difficulty: true,
        exam: true,
        startsAt: true,
        endsAt: true,
        economics: {
          select: {
            entryFee: true,
            rewardPool: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    if (filters?.cursor) {
      queryArgs.cursor = { id: filters.cursor };
      queryArgs.skip = 1; // Skip the cursor itself
    }

    const competitions = await prisma.competition.findMany(queryArgs);
    
    let nextCursor: string | undefined = undefined;
    if (competitions.length > limit) {
      const nextItem = competitions.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: competitions,
      nextCursor
    };
  }
}

export const discoveryService = new CompetitionDiscoveryService();
