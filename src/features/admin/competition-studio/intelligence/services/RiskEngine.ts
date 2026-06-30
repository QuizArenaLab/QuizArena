/**
 * Risk Engine
 * 
 * Separates operational risks from actionable recommendations.
 */

import { DecisionExplanation } from './ExplainabilityEngine';

export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AssessmentRisk {
  id: string;
  title: string;
  severity: RiskSeverity;
  explanation: DecisionExplanation;
}

class RiskEngineService {
  private risks: AssessmentRisk[] = [];

  reportRisk(
    id: string,
    title: string,
    severity: RiskSeverity,
    explanation: DecisionExplanation
  ): AssessmentRisk {
    const risk: AssessmentRisk = { id, title, severity, explanation };
    this.risks.push(risk);
    return risk;
  }

  clearRisks() {
    this.risks = [];
  }

  getRisks(): AssessmentRisk[] {
    return this.risks;
  }
}

export const RiskEngine = new RiskEngineService();
