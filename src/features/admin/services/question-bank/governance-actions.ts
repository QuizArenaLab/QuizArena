"use server";

import { prisma } from "@/lib/prisma";
import { LifecycleState, QuestionStatus, TriggerSource } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth";

export async function getAdminId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function logGovernanceAudit(
  tx: any,
  questionId: string,
  action: string,
  reason: string,
  adminId: string,
  triggerSource: TriggerSource,
  previousState: LifecycleState | null,
  newState: LifecycleState
) {
  await tx.questionGovernanceAudit.create({
    data: {
      questionId,
      action,
      reason,
      adminId,
      triggerSource,
      previousState,
      newState,
    },
  });
}

/**
 * Move a question to MONITORING state.
 */
export async function moveToMonitoring(questionId: string, reason: string) {
  const adminId = await getAdminId();
  return prisma.$transaction(async (tx) => {
    const question = await tx.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error("Question not found");

    const previousState = question.lifecycleState;
    const newState = LifecycleState.MONITORING;

    await tx.question.update({
      where: { id: questionId },
      data: { lifecycleState: newState },
    });

    await logGovernanceAudit(
      tx,
      questionId,
      "MOVE_TO_MONITORING",
      reason,
      adminId,
      TriggerSource.ADMIN,
      previousState,
      newState
    );
    return true;
  });
}

/**
 * Request a refresh for a question.
 */
export async function requestRefresh(questionId: string, reason: string) {
  const adminId = await getAdminId();
  return prisma.$transaction(async (tx) => {
    const question = await tx.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error("Question not found");

    const previousState = question.lifecycleState;
    const newState = LifecycleState.REFRESH_REQUIRED;

    await tx.question.update({
      where: { id: questionId },
      data: { lifecycleState: newState },
    });

    await logGovernanceAudit(
      tx,
      questionId,
      "REQUEST_REFRESH",
      reason,
      adminId,
      TriggerSource.ADMIN,
      previousState,
      newState
    );
    return true;
  });
}

/**
 * Archive a question (updates the authoring QuestionStatus).
 */
export async function archiveQuestion(questionId: string, reason: string) {
  const adminId = await getAdminId();
  return prisma.$transaction(async (tx) => {
    const question = await tx.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error("Question not found");

    await tx.question.update({
      where: { id: questionId },
      data: { status: QuestionStatus.ARCHIVED },
    });

    await tx.questionAuditLog.create({
      data: {
        questionId,
        action: "ARCHIVED",
        actorId: adminId,
        reason,
        previousStatus: question.status,
        nextStatus: QuestionStatus.ARCHIVED,
      },
    });

    return true;
  });
}

/**
 * Force a question back to HEALTHY state.
 */
export async function forceActive(questionId: string, reason: string) {
  const adminId = await getAdminId();
  return prisma.$transaction(async (tx) => {
    const question = await tx.question.findUnique({ where: { id: questionId } });
    if (!question) throw new Error("Question not found");

    const previousState = question.lifecycleState;
    const newState = LifecycleState.HEALTHY;

    await tx.question.update({
      where: { id: questionId },
      data: { lifecycleState: newState },
    });

    await logGovernanceAudit(
      tx,
      questionId,
      "FORCE_ACTIVE",
      reason,
      adminId,
      TriggerSource.ADMIN,
      previousState,
      newState
    );
    return true;
  });
}

/**
 * Dismiss a system generated signal (mock implementation for signal dismissal).
 */
export async function dismissSignal(questionId: string, signalType: string, reason: string) {
  const adminId = await getAdminId();
  // In a full implementation, you would store dismissed signals in a specific table
  // like QuestionRecommendationDismissal.
  await prisma.questionRecommendationDismissal.create({
    data: {
      questionId,
      recommendationType: signalType,
      dismissedById: adminId,
    },
  });

  return true;
}
