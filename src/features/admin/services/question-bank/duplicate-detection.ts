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

export interface DuplicateCandidate {
  id: string;
  questionCode?: string;
  similarity: number;
  matchType: "EXACT" | "NEAR" | "OPTION";
  category?: string;
  subject?: string;
  topic?: string;
  status: string;
  createdAt: Date;
}

export interface DuplicateCheckResult {
  status: "NONE" | "SIMILAR" | "EXACT";
  highestScore: number;
  candidates: DuplicateCandidate[];
  referenceId?: string;
  explanationWarning?: boolean;
}

/**
 * Check for duplicate or near-duplicate questions in the database.
 *
 * @param data - The question payload containing question, options, explanation, category, subject
 * @param excludeId - Question ID to exclude (for updates)
 * @param similarityThreshold - Minimum similarity for near-duplicate (default: 0.80)
 */
export async function checkForDuplicates(
  data: {
    question: string;
    category?: string;
    subject?: string;
    explanation?: string;
    options?: { optionText: string; isCorrect: boolean }[];
  },
  excludeId?: string,
  similarityThreshold = 0.8
): Promise<DuplicateCheckResult> {
  const result: DuplicateCheckResult = {
    status: "NONE",
    highestScore: 0,
    candidates: [],
    explanationWarning: false,
  };

  if (!data.question || data.question.trim().length < 5) return result;

  const normalized = normalizeText(data.question);

  // Build where clause
  const where: Record<string, unknown> = {};
  if (excludeId) {
    where.id = { not: excludeId };
  }
  if (data.category) where.category = data.category;
  if (data.subject) where.subject = data.subject;

  // Only check active, non-archived questions
  where.status = { notIn: ["ARCHIVED", "REJECTED"] };

  // Fetch candidates (limited scope for performance)
  const candidates = await prisma.question.findMany({
    where,
    select: {
      id: true,
      question: true,
      questionCode: true,
      category: true,
      subject: true,
      topic: true,
      status: true,
      createdAt: true,
      options: {
        select: { optionText: true, isCorrect: true },
        orderBy: { order: "asc" },
      },
    },
    take: 500, // Cap for performance
    orderBy: { createdAt: "desc" },
  });

  // Check each candidate
  for (const candidate of candidates) {
    const candidateNormalized = normalizeText(candidate.question);
    let matchType: DuplicateCandidate["matchType"] | null = null;
    let currentSimilarity = 0;

    // Level 1: Exact match
    if (candidateNormalized === normalized) {
      matchType = "EXACT";
      currentSimilarity = 1.0;
    } else {
      // Level 2: Near-duplicate check
      currentSimilarity = calculateSimilarity(normalized, candidateNormalized);
      if (currentSimilarity >= similarityThreshold) {
        matchType = "NEAR";
      } else if (
        data.options &&
        candidate.options &&
        data.options.length === candidate.options.length
      ) {
        // Level 3: Option Duplicate check
        let optionsMatch = true;
        for (let i = 0; i < data.options.length; i++) {
          if (
            normalizeText(data.options[i].optionText) !==
              normalizeText(candidate.options[i].optionText) ||
            data.options[i].isCorrect !== candidate.options[i].isCorrect
          ) {
            optionsMatch = false;
            break;
          }
        }
        if (optionsMatch) {
          matchType = "OPTION";
          currentSimilarity = 0.95; // Arbitrary high score for identical options
        }
      }
    }

    if (matchType) {
      result.candidates.push({
        id: candidate.id,
        questionCode: candidate.questionCode ?? undefined,
        similarity: currentSimilarity,
        matchType,
        category: candidate.category ?? undefined,
        subject: candidate.subject ?? undefined,
        topic: candidate.topic ?? undefined,
        status: candidate.status,
        createdAt: candidate.createdAt,
      });

      if (currentSimilarity > result.highestScore) {
        result.highestScore = currentSimilarity;
        result.referenceId = candidate.id;
      }
    }
  }

  // Level 5: Explanation Duplicate Check
  if (data.explanation && data.explanation.trim().length > 10) {
    const explanationCount = await prisma.question.count({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        explanation: { equals: data.explanation.trim() },
        status: { notIn: ["ARCHIVED", "REJECTED"] },
      },
    });
    // If the exact explanation is used in more than 3 other questions, flag it
    if (explanationCount > 3) {
      result.explanationWarning = true;
    }
  }

  // Set the overall status
  if (result.candidates.some((c) => c.matchType === "EXACT")) {
    result.status = "EXACT";
  } else if (result.candidates.length > 0) {
    result.status = "SIMILAR";
  }

  // Sort candidates by similarity DESC
  result.candidates.sort((a, b) => b.similarity - a.similarity);

  return result;
}
