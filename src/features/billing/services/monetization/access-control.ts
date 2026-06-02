import { prisma } from "@/lib/prisma";
import { SubscriptionStatus, PremiumAccessLevel, SubscriptionPlan } from "@/generated/prisma";

export async function validatePremiumAccess(
  userId: string,
  challengeId: string
): Promise<{
  hasAccess: boolean;
  reason: string;
}> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { premiumAccess: true },
  });

  if (!challenge) {
    return { hasAccess: false, reason: "CHALLENGE_NOT_FOUND" };
  }

  // Free challenge
  if (!challenge.premiumAccess || challenge.premiumAccess.accessLevel === PremiumAccessLevel.FREE) {
    return { hasAccess: true, reason: "FREE_ACCESS" };
  }

  // Challenge requires premium, check user subscription
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      expiresAt: { gt: new Date() },
    },
    include: { plan: true },
  });

  if (!activeSubscription) {
    return { hasAccess: false, reason: "NO_ACTIVE_SUBSCRIPTION" };
  }

  // Handle plan tier logic
  if (challenge.premiumAccess.accessLevel === PremiumAccessLevel.HARDCORE) {
    // If we require hardcore, check if the plan is named 'hardcore' or similar logic
    // We can rely on requiredPlanId if it is set.
    if (
      challenge.premiumAccess.requiredPlanId &&
      challenge.premiumAccess.requiredPlanId !== activeSubscription.planId
    ) {
      return { hasAccess: false, reason: "INSUFFICIENT_PLAN_TIER" };
    }
  }

  return { hasAccess: true, reason: "PREMIUM_ACCESS_GRANTED" };
}

export async function getSubscriptionStatus(userId: string): Promise<{
  status: SubscriptionStatus | "NONE";
  plan: SubscriptionPlan | null;
  expiresAt: Date | null;
}> {
  const sub = await prisma.userSubscription.findFirst({
    where: { userId },
    orderBy: { startsAt: "desc" },
    include: { plan: true },
  });

  if (!sub) return { status: "NONE", plan: null, expiresAt: null };

  if (sub.status === SubscriptionStatus.ACTIVE && sub.expiresAt && sub.expiresAt > new Date()) {
    return { status: SubscriptionStatus.ACTIVE, plan: sub.plan, expiresAt: sub.expiresAt };
  }

  if (sub.status === SubscriptionStatus.ACTIVE && sub.expiresAt && sub.expiresAt <= new Date()) {
    return { status: SubscriptionStatus.EXPIRED, plan: sub.plan, expiresAt: sub.expiresAt };
  }

  return { status: sub.status, plan: sub.plan, expiresAt: sub.expiresAt };
}
