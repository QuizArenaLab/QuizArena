import { RankingCandidateSnapshot } from '../../types/RankingCandidateSnapshot';
import { RankingSnapshot } from '../../models/RankingSnapshots';
import { TieBreakerEngine } from './TieBreakerEngine';

export class RankingAlgorithmEngine {
  private tieBreaker: TieBreakerEngine;

  constructor(tieBreaker: TieBreakerEngine = new TieBreakerEngine()) {
    this.tieBreaker = tieBreaker;
  }

  public sortAndRank(candidates: RankingCandidateSnapshot[]): RankingSnapshot[] {
    const sorted = [...candidates].sort((a, b) => this.tieBreaker.compare(a, b));
    
    return sorted.map((candidate, index) => ({
      rank: index + 1,
      candidate
    }));
  }
}
