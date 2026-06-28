import { CompetitionWithRelations } from "../../types";
import {
  ValidationCategory,
  ValidationItem,
  ValidationReport,
  ValidationSeverity,
} from "./types/validation.types";
import { validateConfiguration } from "./validators/configuration.validator";
import { validateStructure } from "./validators/structure.validator";
import { validateQuestionQuality } from "./validators/question-quality.validator";
import { validateRules } from "./validators/rules.validator";
import { validateScheduling } from "./validators/scheduling.validator";
import { validateBusiness } from "./validators/business.validator";

/**
 * Generates a simplistic hash based on updated timestamps of competition and questions
 * to determine if validation needs to be re-run.
 */
export function generateValidationCacheHash(competition: CompetitionWithRelations): string {
  const compUpdated = competition.updatedAt.getTime().toString();
  const questionsUpdated = competition.questions
    .map((q) => q.question.updatedAt.getTime())
    .reduce((a, b) => a + b, 0)
    .toString();

  return `${compUpdated}-${questionsUpdated}-${competition.questions.length}`;
}

export function runValidationEngine(
  competition: CompetitionWithRelations,
  previousReport?: ValidationReport
): ValidationReport {
  const currentHash = generateValidationCacheHash(competition);

  // If hash matches and we have a previous report, return cached report
  if (previousReport && previousReport.cacheHash === currentHash) {
    return previousReport;
  }

  // Run all validators
  const configItems = validateConfiguration(competition);
  const structureItems = validateStructure(competition);
  const qualityItems = validateQuestionQuality(competition);
  const rulesItems = validateRules(competition);
  const schedulingItems = validateScheduling(competition);
  const businessItems = validateBusiness(competition);

  const allItems = [
    ...configItems,
    ...structureItems,
    ...qualityItems,
    ...rulesItems,
    ...schedulingItems,
    ...businessItems,
  ];

  // Aggregate results
  const counts: Record<ValidationSeverity, number> = {
    error: 0,
    warning: 0,
    recommendation: 0,
  };

  const byCategory: Record<ValidationCategory, ValidationItem[]> = {
    CONFIGURATION: configItems,
    STRUCTURE: structureItems,
    QUESTION_QUALITY: qualityItems,
    RULES: rulesItems,
    SCHEDULING: schedulingItems,
    BUSINESS: businessItems,
  };

  allItems.forEach((item) => {
    counts[item.severity]++;
  });

  return {
    competitionId: competition.id,
    items: allItems,
    counts,
    byCategory,
    generatedAt: new Date().toISOString(),
    cacheHash: currentHash,
  };
}
