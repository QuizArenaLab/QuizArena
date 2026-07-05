import { SubmissionContext } from '../context/SubmissionContext';

export class RankingPayloadBuilder {
  /**
   * Prepares the payload for the Leaderboard domain. Does NOT rank.
   */
  public async build(context: SubmissionContext): Promise<any> {
    console.log(`[RankingPayloadBuilder] Building ranking payload for attempt ${context.package.attemptId}`);
    return {
      score: context.scores?.total || 0,
      accuracy: 0,
      duration: context.package.duration,
      tieBreakers: {},
      metadata: {}
    };
  }
}
