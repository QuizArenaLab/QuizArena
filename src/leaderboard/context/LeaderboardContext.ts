import { RankingCandidateSnapshot } from '../types/RankingCandidateSnapshot';
import { RankingAggregate } from '../models/RankingAggregate';

export interface LeaderboardContextConfig {
  competitionId: string;
  scope: string;
  policy: any; // Would be LeaderboardPolicy
  algorithm: any; // Would be Algorithm definition
}

export class LeaderboardContext {
  private config: LeaderboardContextConfig;
  private candidate: RankingCandidateSnapshot | null = null;
  private existingAggregate: RankingAggregate | null = null;

  constructor(config: LeaderboardContextConfig) {
    this.config = config;
  }

  public setCandidate(candidate: RankingCandidateSnapshot): void {
    this.candidate = candidate;
  }

  public getCandidate(): RankingCandidateSnapshot {
    if (!this.candidate) {
      throw new Error('Candidate not set in context');
    }
    return this.candidate;
  }

  public setExistingAggregate(aggregate: RankingAggregate): void {
    this.existingAggregate = aggregate;
  }

  public getExistingAggregate(): RankingAggregate | null {
    return this.existingAggregate;
  }

  public getConfig(): LeaderboardContextConfig {
    return this.config;
  }
}
