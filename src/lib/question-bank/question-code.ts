/**
 * QuizArena — Deterministic Question Code Generation
 *
 * Generates unique, human-readable, category-aware question codes.
 * Format: QA-{CATEGORY_ABBREV}-{ZERO_PADDED_COUNTER}
 * Example: QA-QUANT-000234
 *
 * Uses atomic Prisma transactions to ensure uniqueness under concurrency.
 * Question codes are immutable once assigned.
 */

import { prisma } from "@/lib/prisma";
import {
  CATEGORY_ABBREVIATION_MAP,
  QUESTION_CODE_PREFIX,
  QUESTION_CODE_SEPARATOR,
  QUESTION_CODE_PAD_LENGTH,
} from "./constants";

/**
 * Get the abbreviation for a category string.
 * Falls back to first 4 characters uppercased if not in the map.
 */
export function getCategoryAbbreviation(category: string): string {
  if (CATEGORY_ABBREVIATION_MAP[category]) {
    return CATEGORY_ABBREVIATION_MAP[category];
  }
  // Fallback: take first 4 chars, uppercase, strip non-alpha
  return category
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();
}

/**
 * Generate a deterministic, unique question code using atomic counter.
 *
 * Uses Prisma's upsert with increment to ensure atomicity.
 * The counter is per-category to keep codes meaningful.
 */
export async function generateQuestionCode(category: string): Promise<string> {
  const abbreviation = getCategoryAbbreviation(category);
  const normalizedCategory = abbreviation.toUpperCase();

  // Atomic upsert + increment
  const counter = await prisma.questionCodeCounter.upsert({
    where: { category: normalizedCategory },
    update: { counter: { increment: 1 } },
    create: { category: normalizedCategory, counter: 1 },
  });

  const paddedNumber = String(counter.counter).padStart(QUESTION_CODE_PAD_LENGTH, "0");

  return [QUESTION_CODE_PREFIX, normalizedCategory, paddedNumber].join(QUESTION_CODE_SEPARATOR);
}

/**
 * Parse a question code into its components.
 */
export function parseQuestionCode(code: string): {
  prefix: string;
  category: string;
  number: number;
} | null {
  const parts = code.split(QUESTION_CODE_SEPARATOR);
  if (parts.length !== 3) return null;

  const [prefix, category, numberStr] = parts;
  const number = parseInt(numberStr, 10);

  if (isNaN(number)) return null;

  return { prefix, category, number };
}

/**
 * Validate that a question code follows the expected format.
 */
export function isValidQuestionCode(code: string): boolean {
  const parsed = parseQuestionCode(code);
  if (!parsed) return false;
  return parsed.prefix === QUESTION_CODE_PREFIX && parsed.number > 0;
}
