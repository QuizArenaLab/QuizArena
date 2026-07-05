import { prisma } from "@/lib/prisma";

export interface CompetitionHistoryEntry {
  submissionId: string;
  competitionId: string;
  competitionTitle: string;
  score: number | null;
  percentage: number | null;
  rank: number | null;
  status: string;
  submittedAt: string;
}

export class CompetitionHistoryFacade {
  /**
   * Retrieves a candidate's complete competition history using the V2 Schema.
   */
  public static async getCandidateHistory(userId: string, limit: number = 10): Promise<CompetitionHistoryEntry[]> {
    const attempts = await prisma.competitionAttempt.findMany({
      where: {
        userId,
      },
      take: limit,
      include: {
        competition: true,
        submissionRecord: {
          include: {
            result: true,
          }
        },
        session: true
      },
      orderBy: {
        session: { startedAt: "desc" }
      }
    });

    return attempts.map(attempt => {
      const submission = attempt.submissionRecord;
      const result = submission?.result;

      let rank = null;
      if (result?.rankingSnapshot && typeof result.rankingSnapshot === 'object' && 'rank' in (result.rankingSnapshot as any)) {
        rank = (result.rankingSnapshot as any).rank;
      }

      return {
        submissionId: submission?.id || attempt.id,
        competitionId: attempt.competitionId,
        competitionTitle: attempt.competition.title,
        score: result?.score || null,
        percentage: result?.percentage || null,
        rank: rank,
        status: submission ? "COMPLETED" : "INCOMPLETE",
        submittedAt: submission?.submittedAt.toISOString() || attempt.session.startedAt.toISOString()
      };
    });
  }
}
