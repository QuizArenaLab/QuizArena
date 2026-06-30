/**
 * Recommendation Engine
 * 
 * Manages the generation, lifecycle, and prioritization of recommendations.
 */

import { ConfidenceScore } from './ConfidenceEngine';
import { DecisionExplanation } from './ExplainabilityEngine';

export type RecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type RecommendationLifecycle = 'NEW' | 'ACKNOWLEDGED' | 'ACCEPTED' | 'RESOLVED' | 'DISMISSED' | 'EXPIRED';

export interface AssessmentRecommendation {
  id: string;
  title: string;
  priority: RecommendationPriority;
  lifecycle: RecommendationLifecycle;
  confidence: ConfidenceScore;
  explanation: DecisionExplanation;
  timestamp: number;
}

class RecommendationEngineService {
  private recommendations: Map<string, AssessmentRecommendation> = new Map();

  generateRecommendation(
    id: string,
    title: string,
    priority: RecommendationPriority,
    confidence: ConfidenceScore,
    explanation: DecisionExplanation
  ): AssessmentRecommendation {
    const rec: AssessmentRecommendation = {
      id,
      title,
      priority,
      lifecycle: 'NEW',
      confidence,
      explanation,
      timestamp: Date.now()
    };
    
    // In production, we'd persist this history and avoid duplicating exact active recommendations
    this.recommendations.set(id, rec);
    return rec;
  }

  updateLifecycle(id: string, state: RecommendationLifecycle) {
    const rec = this.recommendations.get(id);
    if (rec) {
      rec.lifecycle = state;
    }
  }

  getActiveRecommendations(): AssessmentRecommendation[] {
    const priorityWeight = { 'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4, 'INFO': 5 };
    
    return Array.from(this.recommendations.values())
      .filter(r => r.lifecycle === 'NEW' || r.lifecycle === 'ACKNOWLEDGED')
      .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
  }
}

export const RecommendationEngine = new RecommendationEngineService();
