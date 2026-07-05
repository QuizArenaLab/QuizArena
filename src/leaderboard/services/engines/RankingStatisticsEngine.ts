import { RankingSnapshot, StatisticsSnapshot } from '../../models/RankingSnapshots';

export class RankingStatisticsEngine {
  public calculate(snapshots: RankingSnapshot[]): StatisticsSnapshot {
    const participationCount = snapshots.length;

    if (participationCount === 0) {
      return {
        competitionAverageScore: 0,
        medianScore: 0,
        highestScore: 0,
        lowestScore: 0,
        distribution: {},
        participationCount: 0
      };
    }

    const scores = snapshots.map(s => s.candidate.score).sort((a, b) => a - b);
    
    let totalScore = 0;
    let highestScore = scores[participationCount - 1];
    let lowestScore = scores[0];

    const distribution: Record<string, number> = {};

    scores.forEach(score => {
      totalScore += score;
      
      // Calculate 10-point buckets
      const bucketStart = Math.floor(score / 10) * 10;
      const bucketEnd = bucketStart + 9;
      const bucketKey = `${bucketStart}-${bucketEnd}`;
      
      distribution[bucketKey] = (distribution[bucketKey] || 0) + 1;
    });

    const competitionAverageScore = totalScore / participationCount;
    
    // Median
    const mid = Math.floor(participationCount / 2);
    const medianScore = participationCount % 2 !== 0 
      ? scores[mid] 
      : (scores[mid - 1] + scores[mid]) / 2;

    return {
      competitionAverageScore,
      medianScore,
      highestScore,
      lowestScore,
      distribution,
      participationCount
    };
  }
}
