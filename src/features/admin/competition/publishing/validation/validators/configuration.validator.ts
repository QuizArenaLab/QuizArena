import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

export function validateConfiguration(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  // CONF001: Title exists and meets minimum length
  if (!competition.title || competition.title.trim().length < 3) {
    items.push({
      id: `conf-title-${competition.id}`,
      category: "CONFIGURATION",
      severity: "error",
      code: "CONF001",
      title: "Invalid Title",
      description: "Competition title must be at least 3 characters long.",
      affectedEntity: { type: "config", id: competition.id, label: "Title" },
      fixSuggestion: "Provide a descriptive title for the competition.",
    });
  }

  // CONF002: Description exists
  if (!competition.description || competition.description.trim().length === 0) {
    items.push({
      id: `conf-desc-${competition.id}`,
      category: "CONFIGURATION",
      severity: "recommendation",
      code: "CONF002",
      title: "Missing Description",
      description: "A description helps users understand the competition.",
      affectedEntity: { type: "config", id: competition.id, label: "Description" },
      fixSuggestion: "Add a short description explaining what this competition is about.",
    });
  }

  // CONF003: Competition type selected
  if (!competition.competitionType) {
    items.push({
      id: `conf-type-${competition.id}`,
      category: "CONFIGURATION",
      severity: "error",
      code: "CONF003",
      title: "Missing Competition Type",
      description: "A competition type must be selected.",
      affectedEntity: { type: "config", id: competition.id, label: "Type" },
    });
  }

  // CONF005: Duration configured (> 0)
  if (!competition.durationMinutes || competition.durationMinutes <= 0) {
    items.push({
      id: `conf-duration-${competition.id}`,
      category: "CONFIGURATION",
      severity: "error",
      code: "CONF005",
      title: "Invalid Duration",
      description: "Competition duration must be greater than 0 minutes.",
      affectedEntity: { type: "config", id: competition.id, label: "Duration" },
      fixSuggestion: "Set a valid duration in minutes.",
    });
  }

  // CONF007: Maximum marks valid (> 0)
  if (!competition.maximumMarks || competition.maximumMarks <= 0) {
    items.push({
      id: `conf-max-marks-${competition.id}`,
      category: "CONFIGURATION",
      severity: "error",
      code: "CONF007",
      title: "Invalid Maximum Marks",
      description: "Maximum marks must be greater than 0.",
      affectedEntity: { type: "config", id: competition.id, label: "Maximum Marks" },
      fixSuggestion: "Assign marks to questions to calculate maximum marks.",
    });
  }

  // CONF006: Passing marks valid (<= max marks)
  if (competition.config?.passingMarks !== undefined && competition.config.passingMarks !== null) {
    if (competition.config.passingMarks > competition.maximumMarks) {
      items.push({
        id: `conf-pass-marks-${competition.id}`,
        category: "CONFIGURATION",
        severity: "error",
        code: "CONF006",
        title: "Invalid Passing Marks",
        description: "Passing marks cannot be greater than maximum marks.",
        affectedEntity: { type: "config", id: competition.id, label: "Passing Marks" },
        fixSuggestion: "Adjust passing marks to be less than or equal to maximum marks.",
      });
    }
  }

  // CONF008: Language selected
  if (!competition.language) {
    items.push({
      id: `conf-language-${competition.id}`,
      category: "CONFIGURATION",
      severity: "warning",
      code: "CONF008",
      title: "Missing Language",
      description: "Primary language is not explicitly set.",
      affectedEntity: { type: "config", id: competition.id, label: "Language" },
      fixSuggestion: "Set a language or it will default to English.",
    });
  }

  return items;
}
