import { z } from "zod";
import { DraftQuestionInput } from "./question";

export type QuestionHealthStatus = "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "POOR";
export type QuestionHealthGrade = "A+" | "A" | "B" | "C" | "D";

export interface QuestionHealthResult {
  score: number;
  grade: QuestionHealthGrade;
  status: QuestionHealthStatus;
  blockingErrors: string[];
  improvementSuggestions: string[];
  fieldErrors: Record<string, string>;
  breakdown: {
    structure: number;
    metadata: number;
    explanation: number;
    answerIntegrity: number;
    duplicates: number;
    completeness: number;
  };
}

// Helper to check for spam
const isSpam = (text: string) => {
  if (!text) return true;
  if (text.trim().split(/\s+/).length < 2) return true;
  if (/^(.)\1{4,}$/.test(text.trim())) return true;
  return false;
};

export const questionTextValidator = z
  .string()
  .min(10, "Question must be at least 10 characters.")
  .max(2000, "Question must not exceed 2000 characters.")
  .refine((val) => !isSpam(val), {
    message: "Question must contain meaningful content (no single words or repeated spam).",
  });

export const optionValidator = z
  .string()
  .min(1, "Option text cannot be empty.")
  .max(500, "Option must not exceed 500 characters.");

export function calculateQuestionHealth(
  data: Partial<DraftQuestionInput>,
  duplicateResult?: { status: "NONE" | "SIMILAR" | "EXACT"; candidates?: any[] }
): QuestionHealthResult {
  let structureScore = 25;
  let metadataScore = 20;
  let explanationScore = 20;
  let answerIntegrityScore = 15;
  let duplicateScore = 10;
  let completenessScore = 10;

  const blockingErrors: string[] = [];
  const improvementSuggestions: string[] = [];
  const fieldErrors: Record<string, string> = {};

  // 1. Structure Quality (Max: 25)
  // Checks: Question exists, Options exist, Correct answer exists, lengths valid.
  if (!data.question || data.question.trim() === "") {
    structureScore -= 10;
    blockingErrors.push("Question text is required.");
    fieldErrors.question = "Question text is required.";
  } else {
    const res = questionTextValidator.safeParse(data.question);
    if (!res.success) {
      structureScore -= 10;
      blockingErrors.push("Question text is invalid or spam.");
      fieldErrors.question = res.error.issues[0].message;
    }
  }

  if (!data.options || data.options.length < 4) {
    structureScore -= 10;
    blockingErrors.push("At least 4 options are required.");
    fieldErrors.options = "At least 4 options are required.";
  } else {
    let validOptions = true;
    data.options.forEach((opt, idx) => {
      if (!opt.optionText || opt.optionText.trim() === "") {
        validOptions = false;
        fieldErrors[`options.${idx}.optionText`] = "Option cannot be blank.";
      } else if (opt.optionText.length > 500) {
        validOptions = false;
        fieldErrors[`options.${idx}.optionText`] = "Option text too long.";
      }
    });
    if (!validOptions) {
      structureScore -= 5;
      improvementSuggestions.push("Fix option lengths or blank options (+5)");
    }
  }

  const hasCorrectAnswer = data.options && data.options.some((opt) => opt.isCorrect);
  if (!hasCorrectAnswer) {
    structureScore -= 5;
  }

  structureScore = Math.max(0, structureScore);

  // 2. Metadata Quality (Max: 20)
  // Checks: category (Exam), subject, topic, difficulty, language
  if (!data.category) {
    metadataScore -= 4;
    fieldErrors.category = "Exam/Category is required.";
  }
  if (!data.subject) {
    metadataScore -= 4;
    fieldErrors.subject = "Subject is required.";
  }
  if (!data.topic) {
    metadataScore -= 4;
    improvementSuggestions.push("Add Topic Mapping (+4)");
  }
  if (!data.difficulty) {
    metadataScore -= 4;
    fieldErrors.difficulty = "Difficulty is required.";
  }
  if (!data.language) {
    metadataScore -= 4;
    fieldErrors.language = "Language is required.";
  }
  metadataScore = Math.max(0, metadataScore);

  // 3. Explanation Quality (Max: 20)
  if (!data.explanation || data.explanation.trim() === "") {
    explanationScore = 0;
  } else {
    const len = data.explanation.trim().length;
    if (len < 50) {
      explanationScore = 5;
      improvementSuggestions.push("Improve Explanation (+15)");
    } else if (len >= 50 && len < 100) {
      explanationScore = 15;
      improvementSuggestions.push("Improve Explanation length (+5)");
    } else {
      explanationScore = 20;
    }
  }

  // 4. Answer Integrity (Max: 15)
  if (!data.options || data.options.length === 0) {
    answerIntegrityScore = 0;
  } else {
    const correctCount = data.options.filter((opt) => opt.isCorrect).length;
    if (correctCount === 0) {
      answerIntegrityScore = 0;
      blockingErrors.push("No correct answer selected.");
      fieldErrors.correctAnswer = "You must select a correct answer.";
    } else if (correctCount > 1) {
      answerIntegrityScore = 0;
      blockingErrors.push("Only one option can be correct.");
      fieldErrors.correctAnswer = "Only one option can be correct.";
    }

    const texts = data.options.map((opt) => opt.optionText?.trim().toLowerCase() || "");
    const uniqueTexts = new Set(texts.filter((t) => t.length > 0));
    if (uniqueTexts.size < texts.filter((t) => t.length > 0).length) {
      answerIntegrityScore = 0;
      blockingErrors.push("Duplicate options detected.");
      fieldErrors.options = "Duplicate options detected.";
    }

    if (texts.some((t) => t === "")) {
      answerIntegrityScore = 0;
      blockingErrors.push("Blank options are not allowed.");
    }
  }

  // 5. Duplicate Status (Max: 10)
  if (duplicateResult) {
    if (duplicateResult.status === "NONE") {
      duplicateScore = 10;
    } else if (duplicateResult.status === "SIMILAR") {
      duplicateScore = 5;
      improvementSuggestions.push("Possible Duplicate Found (-5)");
    } else if (duplicateResult.status === "EXACT") {
      duplicateScore = 0;
      blockingErrors.push("Exact duplicate question detected. Cannot publish.");
      improvementSuggestions.push("Exact Duplicate Found (-10)");
    }
  }

  // 6. Content Completeness (Max: 10)
  if (!data.tags || data.tags.length === 0) {
    completenessScore -= 2;
    improvementSuggestions.push("Add Tags (+2)");
  }
  if (!data.explanation || data.explanation.trim() === "") {
    completenessScore -= 2;
    improvementSuggestions.push("Add Explanation (+2)");
  }
  if (!data.topic) {
    completenessScore -= 2;
    // Already suggested in metadata, but impacts completeness as well
  }
  if (!data.language) {
    completenessScore -= 2;
  }
  if (!data.difficulty) {
    completenessScore -= 2;
  }
  completenessScore = Math.max(0, completenessScore);

  // Total Score
  const totalScore =
    structureScore +
    metadataScore +
    explanationScore +
    answerIntegrityScore +
    duplicateScore +
    completenessScore;

  // Grade & Status
  let grade: QuestionHealthGrade = "D";
  let status: QuestionHealthStatus = "POOR";

  if (totalScore >= 90) {
    grade = "A+";
    status = "EXCELLENT";
  } else if (totalScore >= 80) {
    grade = "A";
    status = "GOOD";
  } else if (totalScore >= 70) {
    grade = "B";
    status = "GOOD";
  } else if (totalScore >= 60) {
    grade = "C";
    status = "NEEDS_IMPROVEMENT";
  } else {
    grade = "D";
    status = "POOR";
  }

  return {
    score: totalScore,
    grade,
    status,
    blockingErrors,
    improvementSuggestions: Array.from(new Set(improvementSuggestions)), // deduplicate
    fieldErrors,
    breakdown: {
      structure: structureScore,
      metadata: metadataScore,
      explanation: explanationScore,
      answerIntegrity: answerIntegrityScore,
      duplicates: duplicateScore,
      completeness: completenessScore,
    },
  };
}
