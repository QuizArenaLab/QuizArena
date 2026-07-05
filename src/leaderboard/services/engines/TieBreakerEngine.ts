import { RankingCandidateSnapshot } from '../../types/RankingCandidateSnapshot';

export class TieBreakerEngine {
  /**
   * Compares two candidates and returns:
   *  -1 if candidate A should be ranked higher than B
   *   1 if candidate B should be ranked higher than A
   *   0 if they are exactly equal (should not happen with Attempt ID tie-break)
   */
  public compare(a: RankingCandidateSnapshot, b: RankingCandidateSnapshot): number {
    // 1. Score (Higher is better)
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    // 2. Accuracy (Higher is better)
    if (a.accuracy !== b.accuracy) {
      return b.accuracy - a.accuracy;
    }

    // 3. Completion Time (Lower is better)
    if (a.completionTime !== b.completionTime) {
      return a.completionTime - b.completionTime;
    }

    // 4. Submission Timestamp (Earlier is better)
    const timeA = a.submittedAt.getTime();
    const timeB = b.submittedAt.getTime();
    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // 5. Attempt ID (Deterministic fallback, alphabetical ascending)
    return a.attemptId.localeCompare(b.attemptId);
  }
}
