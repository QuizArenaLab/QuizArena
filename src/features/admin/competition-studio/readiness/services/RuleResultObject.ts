/**
 * Rule Result Object
 * 
 * Strict deterministic return type for every Readiness Rule.
 */

export type RuleStatus = 'PASS' | 'FAIL' | 'SKIPPED';
export type RuleSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface RuleResultObject {
  ruleId: string;
  status: RuleStatus;
  severity: RuleSeverity;
  confidence: number; // 0-100
  evidence: string;
  affectedObjects: string[]; // IDs of sections, questions, etc.
  isBlocking: boolean;
  recommendation: string;
  executionTimeMs: number;
}
