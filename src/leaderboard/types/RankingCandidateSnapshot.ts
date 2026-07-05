export interface RankingCandidateSnapshot {
  attemptId: string;
  userId: string;
  competitionId: string;
  competitionVersionId: string;
  artifactId: string;
  leaderboardScope: string;
  examId?: string;
  score: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  negativeMarks: number;
  completionTime: number; // in milliseconds
  submittedAt: Date;
  evaluationVersion: string;
  rankingAlgorithmVersion: string;
  submissionVersion: string;
  schemaVersion: string;
  fingerprint: string;
}
