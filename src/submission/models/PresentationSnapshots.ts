export interface BaseSnapshot {
  schemaVersion: string;
  snapshotVersion: string;
}

export interface RecommendationSnapshot extends BaseSnapshot {
  recommendations: Array<{
    recommendation: string;
    confidence: number;
    evidence: string;
  }>;
  generatorVersion: string;
  createdAt: Date;
}

export interface PerformanceInsightSnapshot extends BaseSnapshot {
  insights: Array<{
    dimension: string; // e.g., 'Time Management', 'Topic: Math'
    score: number;
    evidence: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
  }>;
}

export interface SectionPerformanceSnapshot extends BaseSnapshot {
  sections: Record<string, {
    marks: number;
    correct: number;
    incorrect: number;
    skipped: number;
    accuracy: number;
    timeSeconds: number;
  }>;
}

export interface ExplanationSnapshot extends BaseSnapshot {
  questions: Record<string, {
    questionText: string;
    options: any[];
    correctAnswer: any;
    explanation: string;
    media: string[];
    images: string[];
    markdown: string;
  }>;
}
