/**
 * Readiness Cache
 * 
 * Caches Rule Results and Domain Scores based on Fingerprint deltas.
 */

import { RuleResultObject } from '../services/RuleResultObject';

class ReadinessCacheService {
  private cache: Map<string, RuleResultObject> = new Map();

  getRuleResult(fingerprint: string, ruleId: string): RuleResultObject | undefined {
    return this.cache.get(`${fingerprint}_${ruleId}`);
  }

  setRuleResult(fingerprint: string, ruleId: string, result: RuleResultObject) {
    this.cache.set(`${fingerprint}_${ruleId}`, result);
  }

  clear() {
    this.cache.clear();
  }
}

export const ReadinessCache = new ReadinessCacheService();
