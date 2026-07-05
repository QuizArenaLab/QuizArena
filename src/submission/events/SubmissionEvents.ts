export interface SubmissionEvent {
  eventId: string;
  attemptId: string;
  timestamp: Date;
}

export interface SubmissionStarted extends SubmissionEvent {
  type: 'SubmissionStarted';
}

export interface SubmissionValidated extends SubmissionEvent {
  type: 'SubmissionValidated';
}

export interface FraudChecked extends SubmissionEvent {
  type: 'FraudChecked';
  assessment: any;
}

export interface EvaluationCompleted extends SubmissionEvent {
  type: 'EvaluationCompleted';
  evaluationSnapshot: any;
}

export interface SubmissionFinalized extends SubmissionEvent {
  type: 'SubmissionFinalized';
}

export interface ResultGenerated extends SubmissionEvent {
  type: 'ResultGenerated';
  submissionResult: any;
}

export interface RankingCandidateSnapshotEvent extends SubmissionEvent {
  type: 'RankingCandidateSnapshot';
  snapshot: {
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
    completionTime: number;
    submittedAt: Date;
    evaluationVersion: string;
    rankingAlgorithmVersion: string;
    submissionVersion: string;
    schemaVersion: string;
    fingerprint: string;
  };
}
