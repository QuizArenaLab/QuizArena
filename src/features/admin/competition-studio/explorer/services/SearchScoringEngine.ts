/**
 * Search Scoring Engine
 * 
 * Scores and ranks questions based on multiple dimensions.
 * Never ranks only by keyword. Context-aware based on the current competition.
 */

import { CompetitionDTO } from '@/shared/types/competition.dto';

export interface QuestionSearchResultDTO {
  id: string;
  title: string;
  type: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  healthScore: number;
  usageCount: number;
  topic: string;
  tags: string[];
}

export class SearchScoringEngineService {
  /**
   * Calculate ranking score (0-100) for a question given the current competition context
   */
  calculateRankingScore(
    question: QuestionSearchResultDTO, 
    competitionContext: CompetitionDTO | undefined, 
    searchQuery: string
  ): number {
    let score = 0;

    // 1. Keyword Match (0-30 points)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (question.title.toLowerCase().includes(q)) score += 20;
      if (question.tags.some(t => t.toLowerCase().includes(q))) score += 10;
    } else {
      score += 15; // baseline for empty search
    }

    // 2. Competition Fit (0-40 points)
    // E.g., balance difficulty, match topics if competition has strict subjects
    if (competitionContext) {
      // Placeholder: assuming competition context dictates we need more HARD questions
      if (question.difficulty === 'HARD') score += 10;
      score += 20; // baseline fit
    } else {
      score += 20;
    }

    // 3. Question Health & Usage (0-30 points)
    score += (question.healthScore / 100) * 15;
    
    // Penalize overused questions slightly, reward moderately used
    if (question.usageCount < 10) score += 15;
    else if (question.usageCount < 100) score += 10;
    else score += 5;

    return Math.min(100, Math.max(0, score));
  }

  rankResults(
    results: QuestionSearchResultDTO[], 
    competitionContext: CompetitionDTO | undefined, 
    searchQuery: string
  ): QuestionSearchResultDTO[] {
    return results.sort((a, b) => {
      const scoreA = this.calculateRankingScore(a, competitionContext, searchQuery);
      const scoreB = this.calculateRankingScore(b, competitionContext, searchQuery);
      return scoreB - scoreA;
    });
  }
}

export const SearchScoringEngine = new SearchScoringEngineService();
