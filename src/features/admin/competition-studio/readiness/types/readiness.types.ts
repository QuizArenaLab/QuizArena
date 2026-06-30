export type ReadinessDecision = 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED';

export interface ReadinessSnapshot {
  fingerprint: string;
  overallScore: number;
  decision: ReadinessDecision;
  domainScores: Record<string, number>;
  blockingIssues: any[]; // Flat array before tree conversion
  warnings: any[];
  timestamp: number;
}
