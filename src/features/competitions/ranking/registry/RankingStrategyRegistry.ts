export interface RankingParticipant {
  userId: string;
  score: number;
  accuracy: number;
  completionTime: number;
  submittedAt: Date;
}

export interface RankedParticipant extends RankingParticipant {
  rank: number;
  percentile: number;
}

export interface RankingStrategy {
  computeRankings(participants: RankingParticipant[]): RankedParticipant[];
}

export class DefaultRankingStrategy implements RankingStrategy {
  /**
   * Deterministic ordering: Higher Score -> Higher Accuracy -> Lower Time -> Earlier Submission
   */
  public computeRankings(participants: RankingParticipant[]): RankedParticipant[] {
    const sorted = [...participants].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      if (a.completionTime !== b.completionTime) return a.completionTime - b.completionTime;
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    });

    const total = sorted.length;
    return sorted.map((participant, index) => {
      const rank = index + 1;
      // Percentile formula: ((Total - Rank) / Total) * 100
      const percentile = total > 1 ? ((total - rank) / total) * 100 : 100;

      return {
        ...participant,
        rank,
        percentile,
      };
    });
  }
}

export class RankingStrategyRegistry {
  private static strategies: Record<string, RankingStrategy> = {
    "DEFAULT": new DefaultRankingStrategy(),
  };

  public static getStrategy(strategyKey: string = "DEFAULT"): RankingStrategy {
    const strategy = this.strategies[strategyKey];
    if (!strategy) {
      throw new Error(`Ranking Strategy '${strategyKey}' not registered.`);
    }
    return strategy;
  }
}
