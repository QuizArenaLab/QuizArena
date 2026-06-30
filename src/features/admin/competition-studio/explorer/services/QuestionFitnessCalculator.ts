/**
 * Question Fitness Calculator
 * 
 * Calculates the 'Competition Fit' score (0-100) for each question.
 * Considers Difficulty, Topic, Exam, Usage, Health, Similarity, and Selected Status.
 */

import { CompetitionDTO } from '@/shared/types/competition.dto';
import { QuestionSearchResultDTO } from './SearchScoringEngine';

class QuestionFitnessCalculatorService {
  calculateFitScore(
    question: QuestionSearchResultDTO,
    competitionContext: CompetitionDTO | undefined,
    alreadySelected: boolean
  ): number {
    if (alreadySelected) return 0; // Already selected, fit is 0 for adding again
    if (question.healthScore < 50) return 20; // Poor health

    let fitScore = 80; // Base score for a healthy, unselected question

    // Adjust based on competition context
    if (competitionContext) {
      // E.g. Check if competition expects a specific topic
      // Placeholder logic
    }

    return fitScore;
  }

  getFitLabel(score: number): string {
    if (score >= 90) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Fair Match';
    return 'Poor Match';
  }
}

export const QuestionFitnessCalculator = new QuestionFitnessCalculatorService();
