/**
 * Explainability Engine
 * 
 * Attaches structured reasoning, evidence, and resolution guidance to every decision.
 * Prevents opaque "AI-style" generic warnings.
 */

export interface DecisionExplanation {
  problem: string;
  reason: string;
  evidence: string;
  affectedSections: string[];
  affectedQuestions: string[];
  impact: string;
  expectedImprovement: string;
}

class ExplainabilityEngineService {
  generateExplanation(
    problem: string,
    reason: string,
    evidence: string,
    affectedSections: string[],
    affectedQuestions: string[],
    impact: string,
    expectedImprovement: string
  ): DecisionExplanation {
    return {
      problem,
      reason,
      evidence,
      affectedSections,
      affectedQuestions,
      impact,
      expectedImprovement
    };
  }
}

export const ExplainabilityEngine = new ExplainabilityEngineService();
