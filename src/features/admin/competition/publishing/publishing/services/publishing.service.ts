import { ChecklistCategory, ChecklistItem } from "../types/publishing.types";
import { ValidationReport, ValidationItem } from "../../validation/types/validation.types";
import { CompetitionWithRelations } from "../../../types";

/**
 * Generates the publish checklist by mapping validation results to checklist categories.
 */
export function generateChecklist(
  competition: CompetitionWithRelations,
  report: ValidationReport
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  const addChecklistItem = (
    id: string,
    category: ChecklistCategory,
    label: string,
    validationItems: ValidationItem[],
    defaultDeepLink?: string
  ) => {
    const errors = validationItems.filter((i) => i.severity === "error");
    const warnings = validationItems.filter((i) => i.severity === "warning");

    let status: "complete" | "warning" | "failed" = "complete";
    if (errors.length > 0) status = "failed";
    else if (warnings.length > 0) status = "warning";

    const relevantItems = errors.length > 0 ? errors : warnings;
    // Attempt to extract deepLink from the first relevant item's affectedEntity
    let deepLink = defaultDeepLink;
    if (relevantItems.length > 0 && relevantItems[0].affectedEntity) {
      deepLink = `/admin/dashboard/competitions/${competition.id}/builder?highlight=${relevantItems[0].affectedEntity.type}`;
      if (relevantItems[0].affectedEntity.id) {
        deepLink += `-${relevantItems[0].affectedEntity.id}`;
      }
    }

    items.push({
      id,
      category,
      label,
      status,
      deepLink,
      failedItems: relevantItems.map((i) => i.code),
    });
  };

  // Map Configuration
  addChecklistItem(
    "chk-info",
    "COMPETITION_INFO",
    "Basic Information",
    report.byCategory.CONFIGURATION,
    `/admin/dashboard/competitions/${competition.id}/edit`
  );

  // Map Structure -> Sections
  const sectionValidation = report.byCategory.STRUCTURE.filter(
    (i) => i.code === "STRC002" || i.code === "STRC003"
  );
  addChecklistItem(
    "chk-sections",
    "SECTIONS",
    "Sections Integrity",
    sectionValidation,
    `/admin/dashboard/competitions/${competition.id}/builder?tab=sections`
  );

  // Map Structure -> Questions
  const questionValidation = report.byCategory.STRUCTURE.filter(
    (i) => !["STRC002", "STRC003"].includes(i.code)
  );
  addChecklistItem(
    "chk-questions",
    "QUESTIONS",
    "Question Mapping",
    questionValidation,
    `/admin/dashboard/competitions/${competition.id}/builder`
  );

  // Map Rules & Eligibility
  const rulesValidation = report.byCategory.RULES.filter((i) => i.code !== "RULE004");
  addChecklistItem(
    "chk-rules",
    "RULES",
    "Rules Configuration",
    rulesValidation,
    `/admin/dashboard/competitions/${competition.id}/edit`
  );

  const eligibilityValidation = report.byCategory.RULES.filter((i) => i.code === "RULE004");
  addChecklistItem(
    "chk-eligibility",
    "ELIGIBILITY",
    "Eligibility Criteria",
    eligibilityValidation,
    `/admin/dashboard/competitions/${competition.id}/edit`
  );

  // Map Quality
  addChecklistItem(
    "chk-quality",
    "QUALITY",
    "Content Quality",
    report.byCategory.QUESTION_QUALITY,
    `/admin/dashboard/competitions/${competition.id}/builder`
  );

  // Map Business
  addChecklistItem(
    "chk-business",
    "PERMISSIONS",
    "Business & Economics",
    report.byCategory.BUSINESS,
    `/admin/dashboard/competitions/${competition.id}/edit`
  );

  // Map Scheduling
  addChecklistItem(
    "chk-schedule",
    "SCHEDULING",
    "Scheduling Setup",
    report.byCategory.SCHEDULING,
    `/admin/dashboard/competitions/${competition.id}/publish` // Typically handled in publish view
  );

  return items;
}
