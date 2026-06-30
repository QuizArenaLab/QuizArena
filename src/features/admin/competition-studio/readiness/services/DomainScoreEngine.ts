/**
 * Domain Score Engine
 * 
 * Aggregates rule results into domain-specific readiness scores (0-100).
 */

import { RuleResultObject } from './RuleResultObject';
import { RuleDomain } from './RuleGraph';

class DomainScoreEngineService {
  calculateScores(ruleResults: RuleResultObject[]): Record<string, number> {
    const scores: Record<string, number> = {
      metadata: 100,
      configuration: 100,
      composition: 100,
      coverage: 100,
      publishing: 100
    };

    // Deduct points based on severity of failures per domain
    const penaltyMap = { 'CRITICAL': 100, 'HIGH': 30, 'MEDIUM': 15, 'LOW': 5, 'INFO': 0 };

    ruleResults.filter(r => r.status === 'FAIL').forEach(failure => {
      const penalty = penaltyMap[failure.severity];
      // In production we would map rule.id back to its domain to subtract from the proper bucket
      // Example deduction from composition:
      scores.composition = Math.max(0, scores.composition - penalty);
    });

    return scores;
  }

  calculateOverallScore(domainScores: Record<string, number>): number {
    const vals = Object.values(domainScores);
    if (vals.length === 0) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.floor(avg);
  }
}

export const DomainScoreEngine = new DomainScoreEngineService();
