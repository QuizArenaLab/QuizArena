/**
 * Rule Explainability Engine
 * 
 * Ensures that every rule failure exposes structured 'Why', 'Evidence',
 * 'Impact', and 'Resolution' data, preventing generic failures.
 */

export interface RuleExplanation {
  why: string;
  evidence: string;
  affectedObjects: string[];
  businessRisk: string;
  impact: string;
  resolution: string;
  estimatedImprovement: string;
}

class RuleExplainabilityEngineService {
  generate(
    why: string,
    evidence: string,
    affectedObjects: string[],
    businessRisk: string,
    impact: string,
    resolution: string,
    estimatedImprovement: string
  ): RuleExplanation {
    return {
      why,
      evidence,
      affectedObjects,
      businessRisk,
      impact,
      resolution,
      estimatedImprovement
    };
  }
}

export const RuleExplainabilityEngine = new RuleExplainabilityEngineService();
