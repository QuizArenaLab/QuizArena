import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

export function validateRules(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  const config = competition.config;
  if (!config) {
    items.push({
      id: `rule-missing-config-${competition.id}`,
      category: "RULES",
      severity: "error",
      code: "RULE000",
      title: "Missing Configuration",
      description: "Competition configuration is entirely missing.",
      affectedEntity: { type: "config", id: competition.id, label: "Configuration" },
    });
    return items;
  }

  // RULE001: Negative marking enabled but per-question value = 0
  if (config.negativeMarkingEnabled && config.negativeMarkPerQuestion === 0) {
    items.push({
      id: `rule-negative-marks-${competition.id}`,
      category: "RULES",
      severity: "warning",
      code: "RULE001",
      title: "Invalid Negative Marking",
      description: "Negative marking is enabled but negative marks per question is set to 0.",
      affectedEntity: { type: "config", id: competition.id, label: "Negative Marking" },
      fixSuggestion: "Set a valid negative mark value or disable negative marking.",
    });
  }

  // RULE002: Attempt limit = 0 (unlimited) warning
  const rules = config.rules as any; // Cast to access structured fields safely

  if (rules && rules.attemptLimit === 0) {
    items.push({
      id: `rule-unlimited-attempts-${competition.id}`,
      category: "RULES",
      severity: "recommendation",
      code: "RULE002",
      title: "Unlimited Attempts",
      description: "Attempt limit is set to 0 (unlimited). Verify if this is intended.",
      affectedEntity: { type: "config", id: competition.id, label: "Attempt Limit" },
      fixSuggestion: "Consider setting a reasonable attempt limit to prevent abuse.",
    });
  }

  // RULE004: Eligibility not configured
  if (!competition.eligibility || !competition.eligibility.criteria) {
    items.push({
      id: `rule-missing-eligibility-${competition.id}`,
      category: "RULES",
      severity: "error",
      code: "RULE004",
      title: "Missing Eligibility Criteria",
      description: "Eligibility criteria have not been configured for this competition.",
      affectedEntity: { type: "config", id: competition.id, label: "Eligibility" },
      fixSuggestion: "Configure the target audience and eligibility requirements.",
    });
  }

  return items;
}
