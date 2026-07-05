import { EvaluationSnapshot } from './EvaluationSnapshot';

export interface SubmissionResult {
  resultId: string;
  attempt: any; // attempt metadata
  evaluationSnapshot: EvaluationSnapshot;
  score: number;
  rankingPayload: any; // Payload for Leaderboard
  resultSummary: any; // UI-ready summary
  recommendationMetadata: any;
  certificateEligibility: boolean;
  rewardEligibility: boolean;
  generatedAt: Date;
}
