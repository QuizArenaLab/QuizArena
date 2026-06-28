export type FraudRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface FraudAssessment {
  risk: FraudRisk;
  flags: string[];
  score: number;
}

export interface EvaluatedAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  isSkipped: boolean;
  marksAwarded: number;
  negativeMarks: number;
}

export interface EvaluationSnapshot {
  evaluatedAnswers: EvaluatedAnswer[];
  competitionVersionId?: string; // Future compatibility
}

export interface ResultSnapshot {
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  marks: number;
  percentage: number;
  timeTakenInSeconds: number;
  fraudRisk: FraudRisk;
  competitionVersion: string;
}

export interface PipelineMetrics {
  validationTimeMs?: number;
  fraudAnalysisTimeMs?: number;
  evaluationTimeMs?: number;
  scoringTimeMs?: number;
  attemptFinalizationTimeMs?: number;
  totalPipelineDurationMs?: number;
}

export interface PipelineContext {
  userId: string;
  competitionId: string;
  sessionId: string;
  
  // Data populated during validation
  competition?: any;
  session?: any;
  config?: any;
  answers?: any[];

  // Data populated during pipeline execution
  fraudAssessment?: FraudAssessment;
  evaluationSnapshot?: EvaluationSnapshot;
  resultSnapshot?: ResultSnapshot;
  
  // Observability
  metrics: PipelineMetrics;
}
