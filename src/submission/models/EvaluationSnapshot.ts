export interface EvaluationSnapshot {
  snapshotId: string;
  attemptId: string;
  questionResults: Record<string, any>;
  marks: number;
  negativeMarks: number;
  correct: number;
  incorrect: number;
  skipped: number;
  sectionScores: Record<string, number>;
  totalTimeSeconds: number;
  evaluationVersion: string;
  artifactVersion: string;
  timestamp: Date;
}
