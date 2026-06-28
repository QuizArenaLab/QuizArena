import {
  ReadinessLevel,
  ReadinessScore,
  ValidationCategory,
  ValidationReport,
  VALIDATION_CATEGORY_WEIGHTS,
} from "./types/validation.types";

export function calculateReadinessScore(report: ValidationReport): ReadinessScore {
  const categoryScores: Record<ValidationCategory, { score: number; weight: number }> = {
    CONFIGURATION: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.CONFIGURATION },
    STRUCTURE: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.STRUCTURE },
    QUESTION_QUALITY: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.QUESTION_QUALITY },
    RULES: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.RULES },
    SCHEDULING: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.SCHEDULING },
    BUSINESS: { score: 0, weight: VALIDATION_CATEGORY_WEIGHTS.BUSINESS },
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const hasBlockingErrors = report.counts.error > 0;

  // Calculate score per category
  Object.keys(categoryScores).forEach((key) => {
    const category = key as ValidationCategory;
    const items = report.byCategory[category];
    const weight = categoryScores[category].weight;

    if (weight > 0) {
      let score = 100;

      // Simple scoring deduction rule per category for visual score
      // -30 per error, -10 per warning
      const errorCount = items.filter((i) => i.severity === "error").length;
      const warningCount = items.filter((i) => i.severity === "warning").length;

      score -= errorCount * 30 + warningCount * 10;
      score = Math.max(0, score); // Ensure score doesn't go below 0

      categoryScores[category].score = score;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }
  });

  const finalScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

  let level: ReadinessLevel = "NEEDS_ATTENTION";

  if (hasBlockingErrors) {
    level = "BLOCKED";
  } else if (finalScore >= 90) {
    level = "READY";
  } else if (finalScore >= 70) {
    level = "NEARLY_READY";
  } else {
    level = "NEEDS_ATTENTION";
  }

  return {
    score: finalScore,
    level,
    categoryScores,
  };
}
