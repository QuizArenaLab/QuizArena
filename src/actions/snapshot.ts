"use server";

import { prisma } from "@/lib/prisma";
import { ChallengeDifficulty } from "@/generated/prisma";

export interface SnapshotValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function generateChallengeSnapshots(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      questions: {
        include: {
          question: {
            include: {
              options: true,
            },
          },
        },
      },
      snapshots: true,
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.snapshots.length > 0) {
    // Snapshots already exist.
    return { success: true };
  }

  const snapshotsToCreate = challenge.questions.map((cq) => {
    const correctOption = cq.question.options.find((opt) => opt.isCorrect);

    if (!correctOption) {
      throw new Error(`Question ${cq.questionId} has no correct option`);
    }

    return {
      challengeId: challenge.id,
      originalQuestionId: cq.questionId,
      questionVersion: cq.question.version,
      questionCode: cq.question.questionCode || cq.questionId,
      question: cq.question.question,
      options: cq.question.options.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
        order: opt.order,
      })),
      correctOption: correctOption.id,
      explanation: cq.question.explanation,
      category: cq.question.category || challenge.category || "GENERAL",
      subject: cq.question.subject || "GENERAL",
      difficulty: cq.question.difficulty,
      tags: cq.question.tags,
      language: cq.question.language,
      orderIndex: cq.orderIndex,
    };
  });

  await prisma.challengeQuestionSnapshot.createMany({
    data: snapshotsToCreate,
  });

  return { success: true };
}

export async function regenerateSnapshots(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { status: true },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.status !== "DRAFT") {
    throw new Error("Snapshots can only be regenerated when the challenge is in DRAFT status");
  }

  await prisma.$transaction(async (tx) => {
    await tx.challengeQuestionSnapshot.deleteMany({
      where: { challengeId },
    });

    const fullChallenge = await tx.challenge.findUnique({
      where: { id: challengeId },
      include: {
        questions: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!fullChallenge) throw new Error("Challenge not found during regeneration");

    const snapshotsToCreate = fullChallenge.questions.map((cq) => {
      const correctOption = cq.question.options.find((opt) => opt.isCorrect);

      if (!correctOption) {
        throw new Error(`Question ${cq.questionId} has no correct option`);
      }

      return {
        challengeId: fullChallenge.id,
        originalQuestionId: cq.questionId,
        questionVersion: cq.question.version,
        questionCode: cq.question.questionCode || cq.questionId,
        question: cq.question.question,
        options: cq.question.options.map((opt) => ({
          id: opt.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
        correctOption: correctOption.id,
        explanation: cq.question.explanation,
        category: cq.question.category || fullChallenge.category || "GENERAL",
        subject: cq.question.subject || "GENERAL",
        difficulty: cq.question.difficulty,
        tags: cq.question.tags,
        language: cq.question.language,
        orderIndex: cq.orderIndex,
      };
    });

    if (snapshotsToCreate.length > 0) {
      await tx.challengeQuestionSnapshot.createMany({
        data: snapshotsToCreate,
      });
    }
  });

  return { success: true };
}

export async function validateSnapshots(challengeId: string): Promise<SnapshotValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      questions: true,
      snapshots: true,
    },
  });

  if (!challenge) {
    return { valid: false, errors: ["Challenge not found"], warnings: [] };
  }

  if (challenge.snapshots.length === 0) {
    if (challenge.questions.length > 0) {
      errors.push("Missing snapshots: Challenge has questions but no snapshots generated.");
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  if (challenge.snapshots.length !== challenge.questions.length) {
    errors.push(
      `Snapshot count mismatch: Expected ${challenge.questions.length}, found ${challenge.snapshots.length}.`
    );
  }

  const snapshotQuestionIds = new Set(challenge.snapshots.map((s) => s.originalQuestionId));
  for (const cq of challenge.questions) {
    if (!snapshotQuestionIds.has(cq.questionId)) {
      errors.push(`Missing snapshot for question ${cq.questionId}.`);
    }
  }

  for (const snapshot of challenge.snapshots) {
    if (!snapshot.correctOption) {
      errors.push(`Snapshot ${snapshot.id} is missing a correct option.`);
    }
    if (!snapshot.question) {
      errors.push(`Snapshot ${snapshot.id} has empty question text.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export async function verifySnapshotIntegrity(challengeId: string): Promise<boolean> {
  const result = await validateSnapshots(challengeId);
  return result.valid;
}

export async function getChallengeSnapshots(challengeId: string) {
  return await prisma.challengeQuestionSnapshot.findMany({
    where: { challengeId },
    orderBy: { orderIndex: "asc" },
  });
}
