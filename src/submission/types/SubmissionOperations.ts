export interface SubmissionMetrics {
  validationTimeMs: number;
  fraudTimeMs: number;
  evaluationTimeMs: number;
  scoringTimeMs: number;
  snapshotTimeMs: number;
  totalTimeMs: number;
}

export interface SubmissionAudit {
  eventId: string;
  stage: string;
  timestamp: Date;
  details: any;
}

export interface SubmissionManifest {
  submissionVersion: string;
  evaluationVersion: string;
  ruleVersion: string;
  artifactVersion: string;
  fraudVersion: string;
}

export interface SubmissionPolicy {
  fraudThreshold: number;
  maxRetry: number;
  evaluationTimeoutMs: number;
  rankingEnabled: boolean;
  certificateEnabled: boolean;
}
