/**
 * QuizArena — Question Duplicate Detection Engine
 *
 * Server-side duplicate detection for question governance.
 * Uses normalized text comparison to detect exact and near-duplicates.
 */

import { prisma } from "@/lib/prisma";

/**
 * Normalize question text for comparison:
 * - lowercase
 * - strip extra whitespace
 * - remove punctuation (keeps alphanumeric and spaces)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculate simple similarity ratio between two strings.
 * Returns a value between 0 (completely different) and 1 (identical).
 * Uses bigram-based similarity (Sørensen–Dice coefficient).
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigramsA = new Set<string>();
  for (let i = 0; i < a.length - 1; i++) {
    bigramsA.add(a.substring(i, i + 2));
  }

  const bigramsB = new Set<string>();
  for (let i = 0; i < b.length - 1; i++) {
    bigramsB.add(b.substring(i, i + 2));
  }

  let intersection = 0;
  for (const bigram of bigramsA) {
    if (bigramsB.has(bigram)) intersection++;
  }

  return (2 * intersection) / (bigramsA.size + bigramsB.size);
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  isNearDuplicate: boolean;
  duplicateId?: string;
  duplicateCode?: string;
  similarity?: number;
}

/**
 * Check for duplicate or near-duplicate questions in the database.
 * Uses a two-phase approach:
 * 1. First checks for exact normalized match
 * 2. Then performs similarity check on questions in the same category/subject
 *
 * @param questionText - The question text to check
 * @param category - Category for scoped search
 * @param excludeId - Question ID to exclude (for updates)
 * @param similarityThreshold - Minimum similarity for near-duplicate (default: 0.85)
 */
export async function checkForDuplicates(
  questionText: string,
  category?: string,
  excludeId?: string,
  similarityThreshold = 0.85
): Promise<DuplicateCheckResult> {
  const normalized = normalizeText(questionText);

  // Build where clause
  const where: Record<string, unknown> = {};
  if (excludeId) {
    where.id = { not: excludeId };
  }
  if (category) {
    where.category = category;
  }
  // Only check active, non-archived questions
  where.status = { notIn: ["ARCHIVED"] };

  // Fetch candidates (limited scope for performance)
  const candidates = await prisma.question.findMany({
    where,
    select: {
      id: true,
      question: true,
      questionCode: true,
    },
    take: 500, // Cap for performance
    orderBy: { createdAt: "desc" },
  });

  // Check each candidate
  for (const candidate of candidates) {
    const candidateNormalized = normalizeText(candidate.question);

    // Exact match
    if (candidateNormalized === normalized) {
      return {
        isDuplicate: true,
        isNearDuplicate: false,
        duplicateId: candidate.id,
        duplicateCode: candidate.questionCode ?? undefined,
        similarity: 1.0,
      };
    }

    // Near-duplicate check
    const similarity = calculateSimilarity(normalized, candidateNormalized);
    if (similarity >= similarityThreshold) {
      return {
        isDuplicate: false,
        isNearDuplicate: true,
        duplicateId: candidate.id,
        duplicateCode: candidate.questionCode ?? undefined,
        similarity,
      };
    }
  }

  return {
    isDuplicate: false,
    isNearDuplicate: false,
  };
}
