"use server";

import { prisma } from "@/lib/prisma";
import { PaymentProvider, SubscriptionStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth/auth";

export async function createSubscriptionIntent(planId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plan not found");

  const sub = await prisma.userSubscription.create({
    data: {
      userId,
      planId,
      status: SubscriptionStatus.PENDING,
      paymentProvider: PaymentProvider.SYSTEM,
    },
  });

  return { subscriptionId: sub.id, amount: plan.price };
}

export async function verifyPayment(subscriptionId: string, paymentReference: string) {
  // In a real Razorpay integration, you would verify the signature here
  // e.g., const isValid = validateRazorpaySignature(orderId, paymentId, signature, secret);

  const sub = await prisma.userSubscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!sub) throw new Error("Subscription not found");

  return { success: true, paymentReference };
}

export async function activateSubscription(subscriptionId: string, paymentReference: string) {
  const sub = await prisma.userSubscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true },
  });

  if (!sub) throw new Error("Subscription not found");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + sub.plan.duration);

  await prisma.userSubscription.update({
    where: { id: subscriptionId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      paymentReference,
      startsAt: new Date(),
      expiresAt,
    },
  });

  revalidatePath("/dashboard/subscription");
  return { success: true };
}

export async function cancelSubscription(subscriptionId: string) {
  await prisma.userSubscription.update({
    where: { id: subscriptionId },
    data: {
      status: SubscriptionStatus.CANCELLED,
      canceledAt: new Date(),
      autoRenew: false,
    },
  });

  revalidatePath("/dashboard/subscription");
  return { success: true };
}
