/**
 * Confidence Engine
 * 
 * Scores recommendations dynamically (0-100%).
 * Evaluates Question Volume, Data Freshness, and Statistical Sample Size.
 */

export interface ConfidenceScore {
  percentage: number;
  reason: string;
  calculationSource: string;
}

class ConfidenceEngineService {
  
  /**
   * Generates a confidence score based on the underlying data constraints.
   */
  calculateConfidence(
    sampleSize: number, 
    dataFreshnessHours: number, 
    analyzerReliability: number = 0.9
  ): ConfidenceScore {
    let score = 100;

    // Penalize if sample size is too low (e.g. less than 10 questions)
    if (sampleSize < 10) {
      score -= (10 - sampleSize) * 5;
    }

    // Penalize if historical data is stale
    if (dataFreshnessHours > 72) {
      score -= 10;
    }

    score = Math.floor(score * analyzerReliability);

    return {
      percentage: Math.max(0, score),
      reason: sampleSize < 10 ? 'Low sample size reduces confidence' : 'High statistical validity',
      calculationSource: 'ConfidenceEngine_v1'
    };
  }
}

export const ConfidenceEngine = new ConfidenceEngineService();
