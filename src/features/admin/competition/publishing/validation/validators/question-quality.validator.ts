// @ts-nocheck
import { CompetitionWithRelations } from "../../../types";
import { ValidationItem } from "../types/validation.types";

const MINIMUM_HEALTH_SCORE = 60;

export function validateQuestionQuality(competition: CompetitionWithRelations): ValidationItem[] {
  const items: ValidationItem[] = [];

  const lowHealthQuestions = competition.questions.filter(
    (q) => (q.question.healthScore ?? 100) < MINIMUM_HEALTH_SCORE
  );

  // QUAL001: Question health below threshold
  if (lowHealthQuestions.length > 0) {
    items.push({
      id: `qual-health-${competition.id}`,
      category: "QUESTION_QUALITY",
      severity: "warning",
      code: "QUAL001",
      title: "Low Question Health",
      description: `${lowHealthQuestions.length} question(s) have a health score below ${MINIMUM_HEALTH_SCORE}.`,
      affectedEntity: {
        type: "question",
        id: lowHealthQuestions[0].questionId,
        label: "Question Health",
      },
      fixSuggestion: "Review and improve the identified questions.",
    });
  }

  const unapprovedQuestions = competition.questions.filter((q) => q.question.status !== "APPROVED");

  // QUAL006: Unapproved questions
  if (unapprovedQuestions.length > 0) {
    items.push({
      id: `qual-unapproved-${competition.id}`,
      category: "QUESTION_QUALITY",
      severity: "error",
      code: "QUAL006",
      title: "Unapproved Questions Attached",
      description: `${unapprovedQuestions.length} question(s) are not in APPROVED status.`,
      affectedEntity: {
        type: "question",
        id: unapprovedQuestions[0].questionId,
        label: "Question Status",
      },
      fixSuggestion: "Ensure all questions are approved before publishing.",
    });
  }

  // QUAL003: Missing explanations
  const missingExplanations = competition.questions.filter(
    (q) => !q.question.explanation || q.question.explanation.trim().length === 0
  );

  if (missingExplanations.length > 0) {
    items.push({
      id: `qual-explanation-${competition.id}`,
      category: "QUESTION_QUALITY",
      severity: "recommendation",
      code: "QUAL003",
      title: "Missing Explanations",
      description: `${missingExplanations.length} question(s) do not have an explanation.`,
      affectedEntity: {
        type: "question",
        id: missingExplanations[0].questionId,
        label: "Missing Explanation",
      },
      fixSuggestion: "Provide explanations for questions to enhance user learning.",
    });
  }

  return items;
}
