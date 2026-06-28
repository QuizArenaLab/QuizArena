"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { checkEligibility } from "./eligibility.service";
import type {
  InitializationResult,
  SessionResult,
  WorkspaceInitPayload,
  CompetitionQuestion,
  CompetitionOption,
} from "@/types/competition-experience";

/**
 * Deterministic shuffle using a seed derived from sessionId.
 */
function seededShuffle<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function initializeSession(
  competitionSlug: string
): Promise<SessionResult<InitializationResult>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  // 1. Eligibility Check
  const eligibility = await checkEligibility(competitionSlug);
  if (!eligibility.success || !eligibility.data) {
    return { success: false, error: eligibility.error };
  }
  const competitionId = eligibility.data.competitionId;

  // 2. Load the Competition and its active Version Snapshot
  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: {
      versions: {
        where: { isActive: true },
        take: 1,
      },
    },
  });

  if (!competition || competition.versions.length === 0) {
    return { success: false, error: "Competition version not found or inactive." };
  }

  const activeVersion = competition.versions[0];
  const questionsSnapshot = activeVersion.questionsSnapshot as any[]; // Array of mapped questions from the version
  const competitionSnapshot = activeVersion.competitionSnapshot as any;

  if (!questionsSnapshot || !Array.isArray(questionsSnapshot)) {
    return { success: false, error: "Invalid competition snapshot data." };
  }

  // 3. Find or Create Session
  let compSession = await prisma.competitionSession.findUnique({
    where: {
      userId_competitionId: {
        userId,
        competitionId,
      },
    },
    include: {
      answers: true,
    },
  });

  if (!compSession) {
    const shuffleSeed = `${userId}-${competitionId}-${Date.now()}`;
    const durationMinutes = competitionSnapshot.durationMinutes || competition.durationMinutes;

    // Server-Authoritative Timer Start
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    // Initial shuffle maps
    const questionIds = questionsSnapshot.map((q) => q.questionId);
    const questionOrder = seededShuffle(questionIds, shuffleSeed);

    const optionOrder: Record<string, string[]> = {};
    for (const cq of questionsSnapshot) {
      if (cq.options) {
        const optionIds = cq.options.map((o: any) => o.id);
        optionOrder[cq.questionId] = seededShuffle(optionIds, `${shuffleSeed}-${cq.questionId}`);
      }
    }

    compSession = await prisma.competitionSession.create({
      data: {
        competitionId,
        userId,
        status: "IN_PROGRESS",
        startedAt,
        expiresAt,
        shuffleSeed,
        questionOrder,
        optionOrder,
      },
      include: {
        answers: true,
      },
    });
  } else {
    // If it exists, ensure it's IN_PROGRESS and timer is valid
    if (
      compSession.status !== "IN_PROGRESS" &&
      compSession.status !== "READY" &&
      compSession.status !== "INITIALIZING"
    ) {
      return { success: false, error: "Cannot resume this session as it is not in progress." };
    }

    // Check timer expiration
    if (compSession.expiresAt && new Date() >= compSession.expiresAt) {
      return { success: false, error: "This session has expired." };
    }

    // Ensure status is IN_PROGRESS if it was READY or INITIALIZING
    if (compSession.status !== "IN_PROGRESS") {
      compSession = await prisma.competitionSession.update({
        where: { id: compSession.id },
        data: { status: "IN_PROGRESS" },
        include: { answers: true },
      });
    }
  }

  // 4. Build Workspace Payload
  const qOrder = compSession.questionOrder as string[];
  const optOrder = compSession.optionOrder as Record<string, string[]>;

  // Build lookup map for questions snapshot
  const snapshotQMap = new Map();
  for (const q of questionsSnapshot) {
    snapshotQMap.set(q.questionId, q);
  }

  const sanitizedQuestions: CompetitionQuestion[] = [];
  const labels = ["A", "B", "C", "D", "E", "F"];

  qOrder.forEach((qid, index) => {
    const snapQ = snapshotQMap.get(qid);
    if (!snapQ) return;

    const rawOptions = snapQ.options || [];
    const optionMap = new Map(rawOptions.map((o: any) => [o.id, o]));
    const shuffledOptIds = optOrder[qid] || rawOptions.map((o: any) => o.id);

    const shuffledOptions: CompetitionOption[] = (shuffledOptIds || [])
      .map((oid: string, optIdx: number) => {
        const opt = optionMap.get(oid) as any;
        if (!opt) return null;
        return {
          id: opt.id,
          text: opt.optionText || opt.text || "", // Handle both variations
          displayLabel: labels[optIdx] || String(optIdx),
        };
      })
      .filter(Boolean) as CompetitionOption[];

    sanitizedQuestions.push({
      questionId: qid,
      question: snapQ.question, // Snapshot uses question text
      options: shuffledOptions,
      order: index,
    });
  });

  // Rebuild answers state
  const initialAnswers: Record<string, string | null> = {};
  const visitedMap: Record<string, boolean> = {};
  const reviewMap: Record<string, boolean> = {};

  compSession.answers.forEach((ans) => {
    initialAnswers[ans.questionId] = ans.selectedOptionId;
    visitedMap[ans.questionId] = ans.isVisited;
    reviewMap[ans.questionId] = ans.isMarkedForReview;
  });

  const workspacePayload: WorkspaceInitPayload = {
    sessionId: compSession.id,
    competitionId: compSession.competitionId,
    competitionSlug: competition.slug,
    competitionTitle: competition.title,
    questions: sanitizedQuestions,
    initialAnswers,
    visitedMap,
    reviewMap,
    serverExpiresAt: compSession.expiresAt
      ? compSession.expiresAt.toISOString()
      : new Date().toISOString(),
    status: compSession.status,
  };

  return {
    success: true,
    data: {
      sessionId: compSession.id,
      workspacePayload,
    },
  };
}
