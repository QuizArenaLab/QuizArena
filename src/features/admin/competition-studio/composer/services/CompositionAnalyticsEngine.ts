/**
 * Composition Analytics Engine
 * 
 * Headless calculation of live metrics: Question Count, Section Balance, 
 * Marks, Negative Marks, Estimated Time, Average Health.
 * 
 * Decoupled from React to ensure performance during rapid mutations.
 */

import { CompositionGraph, QuestionNode, SectionNode } from '../engine/CompositionEngine';

export interface CompositionMetrics {
  totalQuestions: number;
  totalMarks: number;
  totalNegativeMarks: number;
  estimatedDurationMins: number;
  sectionCount: number;
}

class CompositionAnalyticsEngineService {
  calculateMetrics(graph: CompositionGraph | null): CompositionMetrics {
    if (!graph) return {
      totalQuestions: 0,
      totalMarks: 0,
      totalNegativeMarks: 0,
      estimatedDurationMins: 0,
      sectionCount: 0
    };

    let totalQuestions = 0;
    let totalMarks = 0;
    let totalNegativeMarks = 0;
    
    graph.sections.forEach((section: SectionNode) => {
      totalQuestions += section.questions.length;
      section.questions.forEach((q: QuestionNode) => {
        totalMarks += q.marks;
        totalNegativeMarks += q.negativeMarks;
      });
    });

    // Dummy calculation for duration: 1.5 mins per question
    const estimatedDurationMins = totalQuestions * 1.5;

    return {
      totalQuestions,
      totalMarks,
      totalNegativeMarks,
      estimatedDurationMins,
      sectionCount: graph.sections.length
    };
  }
}

export const CompositionAnalyticsEngine = new CompositionAnalyticsEngineService();
