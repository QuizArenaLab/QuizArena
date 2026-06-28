import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

const MINIMUM_QUESTIONS_REQUIRED: Record<string, number> = {
  OPEN_PRACTICE: 1,
  FREE_CHALLENGE: 5,
  PAID_CHALLENGE: 5,
  MOCK_TEST: 10,
  TOURNAMENT: 5,
};

export function validateStructure(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  // STRC001: Minimum question count met for competition type
  const minRequired = MINIMUM_QUESTIONS_REQUIRED[competition.competitionType] || 1;
  if (competition.totalQuestions < minRequired) {
    items.push({
      id: `strc-min-q-${competition.id}`,
      category: "STRUCTURE",
      severity: "error",
      code: "STRC001",
      title: "Insufficient Questions",
      description: `At least ${minRequired} question(s) required for ${competition.competitionType}.`,
      affectedEntity: { type: "config", id: competition.id, label: "Question Count" },
      fixSuggestion: `Add more questions to meet the minimum requirement of ${minRequired}.`,
    });
  }

  // STRC009: Question count matches totalQuestions metadata
  if (competition.questions.length !== competition.totalQuestions) {
    items.push({
      id: `strc-q-count-${competition.id}`,
      category: "STRUCTURE",
      severity: "error",
      code: "STRC009",
      title: "Question Count Mismatch",
      description: `Attached questions (${competition.questions.length}) does not match totalQuestions metadata (${competition.totalQuestions}).`,
      affectedEntity: { type: "config", id: competition.id, label: "Questions" },
    });
  }

  // STRC004: Duplicate questions detected
  const questionIds = competition.questions.map((q) => q.questionId);
  const uniqueQuestionIds = new Set(questionIds);
  if (uniqueQuestionIds.size !== questionIds.length) {
    // Find duplicates
    const duplicates = questionIds.filter((item, index) => questionIds.indexOf(item) !== index);

    items.push({
      id: `strc-duplicate-${competition.id}`,
      category: "STRUCTURE",
      severity: "error",
      code: "STRC004",
      title: "Duplicate Questions",
      description: "Duplicate questions found in the competition.",
      affectedEntity: { type: "question", id: duplicates[0], label: "Duplicate Questions" },
      fixSuggestion: "Remove duplicate questions from the competition.",
    });
  }

  // Check section integrity if sections exist
  if (competition.sections && competition.sections.length > 0) {
    const sectionIds = new Set(competition.sections.map((s) => s.id));
    let hasOrphanedSections = false;

    // Check if any question belongs to a missing section
    competition.questions.forEach((q) => {
      if (q.sectionId && !sectionIds.has(q.sectionId)) {
        hasOrphanedSections = true;
      }
    });

    if (hasOrphanedSections) {
      items.push({
        id: `strc-orphaned-${competition.id}`,
        category: "STRUCTURE",
        severity: "error",
        code: "STRC002",
        title: "Section Integrity Issue",
        description: "Some questions are assigned to a section that no longer exists.",
        affectedEntity: { type: "section", id: "orphaned", label: "Sections" },
        fixSuggestion: "Reassign affected questions to a valid section.",
      });
    }
  }

  return items;
}
