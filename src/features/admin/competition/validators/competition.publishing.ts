// @ts-nocheck
import {
  CompetitionWithRelations,
  ValidationGateResult,
  PublishValidationResult,
  PublishCheck,
} from "../types";

const MINIMUM_QUESTIONS_REQUIRED: Record<string, number> = {
  OPEN_PRACTICE: 1,
  FREE_CHALLENGE: 5,
  PAID_CHALLENGE: 5,
  MOCK_TEST: 10,
  TOURNAMENT: 5,
};

const MINIMUM_HEALTH_SCORE = 60;

/**
 * Validates if a Competition can transition from DRAFT to READY.
 * Must pass all checks to return true.
 */
export function validateCompetitionGate(
  competition: CompetitionWithRelations
): ValidationGateResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basics
  if (!competition.title) errors.push("Title is required.");
  if (!competition.competitionType) errors.push("Competition type is required.");
  if (competition.durationMinutes <= 0) errors.push("Duration must be greater than 0.");

  // Questions
  const minRequired = MINIMUM_QUESTIONS_REQUIRED[competition.competitionType] || 1;
  if (competition.totalQuestions < minRequired) {
    errors.push(`At least ${minRequired} question(s) required for ${competition.competitionType}.`);
  }

  if (competition.questions.length !== competition.totalQuestions) {
    errors.push("Attached question count does not match totalQuestions metadata.");
  }

  // Duplicate checks
  const questionIds = competition.questions.map((q) => q.questionId);
  const uniqueQuestionIds = new Set(questionIds);
  if (uniqueQuestionIds.size !== questionIds.length) {
    errors.push("Duplicate questions found in the competition.");
  }

  // Rules & Eligibility
  if (!competition.config?.rules) {
    errors.push("Competition rules must be configured.");
  }
  if (!competition.eligibility?.criteria) {
    errors.push("Competition eligibility must be configured.");
  }

  // Economics Warning
  if (competition.competitionType === "PAID_CHALLENGE") {
    if (!competition.economics?.entryFee || competition.economics.entryFee <= 0) {
      warnings.push("Paid challenge has no entry fee.");
    }
  }

  // Question Health Warning
  const lowHealthQuestions = competition.questions.filter(
    (q) => (q.question.healthScore ?? 100) < MINIMUM_HEALTH_SCORE
  );
  if (lowHealthQuestions.length > 0) {
    warnings.push(
      `${lowHealthQuestions.length} question(s) have a health score below ${MINIMUM_HEALTH_SCORE}.`
    );
  }

  // Schedule Warning
  if (competition.startsAt && competition.endsAt) {
    if (competition.endsAt <= competition.startsAt) {
      warnings.push("End time must be after start time.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates if a Competition can be PUBLISHED (READY -> SCHEDULED/LIVE).
 * Runs validation gate + strict publish checks.
 */
export function checkPublishPreconditions(
  competition: CompetitionWithRelations
): PublishValidationResult {
  const checks: PublishCheck[] = [];

  // Run validation gate
  const gateResult = validateCompetitionGate(competition);
  gateResult.errors.forEach((err, idx) => {
    checks.push({
      id: `gate-error-${idx}`,
      label: "Validation Gate Error",
      passed: false,
      severity: "error",
      message: err,
    });
  });

  gateResult.warnings.forEach((warn, idx) => {
    checks.push({
      id: `gate-warn-${idx}`,
      label: "Validation Gate Warning",
      passed: false,
      severity: "warning",
      message: warn,
    });
  });

  // Strict publish checks
  const isReadyStatus = competition.status === "READY";
  checks.push({
    id: "status-ready",
    label: "Status is READY",
    passed: isReadyStatus,
    severity: "error",
    message: isReadyStatus ? undefined : "Competition must be in READY state to publish.",
  });

  const allQuestionsApproved = competition.questions.every((q) => q.question.status === "APPROVED");
  checks.push({
    id: "questions-approved",
    label: "All Questions APPROVED",
    passed: allQuestionsApproved,
    severity: "error",
    message: allQuestionsApproved ? undefined : "All attached questions must have APPROVED status.",
  });

  const marksSum = competition.questions.reduce((sum, q) => sum + q.marks, 0);
  const marksMatch = marksSum === competition.maximumMarks;
  checks.push({
    id: "marks-consistency",
    label: "Marks Consistency",
    passed: marksMatch,
    severity: "warning",
    message: marksMatch
      ? undefined
      : `Sum of question marks (${marksSum}) does not match maximumMarks (${competition.maximumMarks}).`,
  });

  const canPublish = checks.filter((c) => c.severity === "error").every((c) => c.passed);

  return {
    canPublish,
    checks,
  };
}
