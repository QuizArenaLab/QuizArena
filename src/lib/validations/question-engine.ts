import { z } from "zod";
import { DraftQuestionInput } from "./question";

export type QuestionHealthLevel = "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "POOR";

export interface QuestionValidationResult {
  score: number;
  health: QuestionHealthLevel;
  blockingErrors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
  breakdown: {
    structure: number;
    options: number;
    correctAnswer: number;
    explanation: number;
    metadata: number;
    duplicates: number;
  };
}

// Helper to check for spam
const isSpam = (text: string) => {
  if (!text) return true;
  // Check if it's just one word
  if (text.trim().split(/\s+/).length < 2) return true;
  // Check for repeated character spam (e.g., "aaaaa", "??????")
  if (/^(.)\1{4,}$/.test(text.trim())) return true;
  return false;
};

export const questionTextValidator = z
  .string()
  .min(10, "Question must be at least 10 characters.")
  .max(1000, "Question must not exceed 1000 characters.")
  .refine((val) => !isSpam(val), {
    message: "Question must contain meaningful content (no single words or repeated spam).",
  });

export const optionValidator = z
  .string()
  .min(1, "Option text cannot be empty.")
  .max(300, "Option must not exceed 300 characters.");

export const explanationValidator = z
  .string()
  .min(50, "Explanation must be at least 50 characters.");

export function calculateQuestionQuality(
  data: Partial<DraftQuestionInput>,
  duplicateResult?: { status: "NONE" | "SIMILAR" | "EXACT"; explanationWarning?: boolean }
): QuestionValidationResult {
  let structureScore = 0;
  let optionsScore = 0;
  let correctAnswerScore = 0;
  let explanationScore = 0;
  let metadataScore = 0;
  let duplicateScore = 0;

  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  const fieldErrors: Record<string, string> = {};

  // 1. Structure Complete (20 points)
  if (data.question) {
    const res = questionTextValidator.safeParse(data.question);
    if (res.success) {
      structureScore = 20;
    } else {
      blockingErrors.push("Question text is invalid or spam.");
      fieldErrors.question = res.error.issues[0].message;
    }
  } else {
    blockingErrors.push("Question text is required.");
    fieldErrors.question = "Question text is required.";
  }

  // 2. Options Complete (20 points)
  if (data.options && data.options.length >= 4) {
    let validOptionsCount = 0;
    const texts = data.options.map((opt) => opt.optionText?.trim() || "");

    const uniqueTexts = new Set(texts.filter((t) => t.length > 0));

    // Check duplicates
    if (uniqueTexts.size < texts.filter((t) => t.length > 0).length) {
      blockingErrors.push("Duplicate options detected.");
      fieldErrors.options = "Duplicate options detected.";
    }

    data.options.forEach((opt, index) => {
      const optRes = optionValidator.safeParse(opt.optionText);
      if (optRes.success) {
        validOptionsCount++;
      } else {
        fieldErrors[`options.${index}.optionText`] = optRes.error.issues[0].message;
      }
    });

    if (validOptionsCount >= 4 && uniqueTexts.size >= 4) {
      optionsScore = 20;
    } else {
      blockingErrors.push("At least 4 valid and unique options are required.");
    }
  } else {
    blockingErrors.push("Options are missing or insufficient.");
    fieldErrors.options = "At least 4 options are required.";
  }

  // 3. Correct Answer (15 points)
  if (data.options && data.options.length > 0) {
    const correctCount = data.options.filter((opt) => opt.isCorrect).length;
    if (correctCount === 1) {
      correctAnswerScore = 15;
    } else if (correctCount === 0) {
      blockingErrors.push("No correct answer selected.");
      fieldErrors.correctAnswer = "You must select a correct answer.";
    } else {
      blockingErrors.push("Only one option can be correct.");
      fieldErrors.correctAnswer = "Only one option can be correct.";
    }
  }

  // 4. Explanation Quality (15 points)
  if (data.explanation) {
    const expRes = explanationValidator.safeParse(data.explanation);
    if (expRes.success) {
      explanationScore = 15;
      if (data.explanation.length >= 100) {
        // Excellent explanation
      } else {
        warnings.push("Explanation is good but could be more detailed (>100 characters).");
      }
    } else {
      blockingErrors.push("Explanation is too short.");
      fieldErrors.explanation = expRes.error.issues[0].message;
    }
  } else {
    blockingErrors.push("Explanation is required.");
    fieldErrors.explanation = "Explanation is required.";
  }

  // 5. Metadata Complete (10 points)
  let metadataItems = 0;
  if (data.category) metadataItems++;
  else fieldErrors.category = "Category is required.";

  if (data.subject) metadataItems++;
  else fieldErrors.subject = "Subject is required.";

  if (data.topic) metadataItems++;
  else fieldErrors.topic = "Topic is required.";

  if (data.difficulty) metadataItems++;
  else fieldErrors.difficulty = "Difficulty is required.";

  if (metadataItems === 4) {
    metadataScore = 10;
  } else {
    metadataScore = Math.floor(metadataItems * 2.5);
    blockingErrors.push("Metadata is incomplete (Exam, Subject, Topic, Difficulty).");
  }

  // 6. Duplicate Detection (20 points)
  if (duplicateResult) {
    if (duplicateResult.status === "NONE") {
      duplicateScore = 20;
    } else if (duplicateResult.status === "SIMILAR") {
      duplicateScore = 0; // -10 effectively since they miss 20 points? Actually the requirement says -10 points.
      // If we start from 80 base + 20 max for duplicates:
      // None = +20. Similar = -10 (which means duplicateScore = -10).
      duplicateScore = -10;
      warnings.push("Possible duplicate question detected.");
    } else if (duplicateResult.status === "EXACT") {
      duplicateScore = 0;
      blockingErrors.push("Exact duplicate question detected. Cannot publish.");
    }

    if (duplicateResult.explanationWarning) {
      warnings.push("This explanation is used heavily across other questions.");
    }
  }

  const totalScore = Math.max(
    0,
    Math.min(
      100,
      structureScore +
        optionsScore +
        correctAnswerScore +
        explanationScore +
        metadataScore +
        duplicateScore
    )
  );

  let health: QuestionHealthLevel = "POOR";
  if (totalScore >= 90) health = "EXCELLENT";
  else if (totalScore >= 75) health = "GOOD";
  else if (totalScore >= 60) health = "NEEDS_IMPROVEMENT";

  if (totalScore < 75 && blockingErrors.length === 0) {
    warnings.push("Question quality could be higher. Improve explanation or structure.");
  }

  return {
    score: totalScore,
    health,
    blockingErrors,
    warnings,
    fieldErrors,
    breakdown: {
      structure: structureScore,
      options: optionsScore,
      correctAnswer: correctAnswerScore,
      explanation: explanationScore,
      metadata: metadataScore,
      duplicates: duplicateScore,
    },
  };
}
