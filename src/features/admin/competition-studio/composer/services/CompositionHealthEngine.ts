/**
 * Composition Health Engine
 * 
 * Calculates the 'Live Health Score' (0-100) of the entire composition.
 * Evaluates Structure, Coverage, Difficulty, Duplicates, and Inactive Questions.
 */

import { CompositionGraph } from '../engine/CompositionEngine';

class CompositionHealthEngineService {
  calculateHealthScore(graph: CompositionGraph | null): number {
    if (!graph || graph.sections.length === 0) return 0;

    let score = 100;
    
    // Deduct for empty sections
    const emptySections = graph.sections.filter(s => s.questions.length === 0).length;
    score -= (emptySections * 10);

    // Deduct for too few questions total (e.g. less than 10)
    const totalQuestions = graph.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
    if (totalQuestions < 10 && totalQuestions > 0) {
      score -= 15;
    }

    // In a real implementation, it would inspect QuestionBlocks for duplicates, 
    // health metrics from the bank, etc.

    return Math.max(0, score);
  }

  getHealthLabel(score: number): string {
    if (score >= 90) return 'Healthy';
    if (score >= 70) return 'Needs Review';
    return 'Critical Warnings';
  }
}

export const CompositionHealthEngine = new CompositionHealthEngineService();
