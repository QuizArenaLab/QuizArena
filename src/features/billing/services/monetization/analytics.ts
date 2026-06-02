import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/generated/prisma";

export async function getMonetizationAnalytics() {
  const [totalSubscriptions, activeSubscriptions, revenueTotal] = await Promise.all([
    prisma.userSubscription.count(),
    prisma.userSubscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
    }),
    // Revenue calculation would require joining plans or tracking amount in transactions
    // For now, mock the revenue calculation
    Promise.resolve(0),
  ]);

  // Aggregate popular plans
  const popularPlansRaw = await prisma.userSubscription.groupBy({
    by: ["planId"],
    _count: {
      planId: true,
    },
    orderBy: {
      _count: {
        planId: "desc",
      },
    },
    take: 5,
  });

  const planIds = popularPlansRaw.map((p) => p.planId);
  const plans = await prisma.subscriptionPlan.findMany({
    where: { id: { in: planIds } },
  });

  const popularPlans = popularPlansRaw.map((p) => ({
    count: p._count.planId,
    plan: plans.find((plan) => plan.id === p.planId),
  }));

  // Assuming conversion rate from all registered users
  const totalUsers = await prisma.user.count();
  const premiumConversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;

  return {
    totalSubscriptions,
    activeSubscriptions,
    premiumConversionRate,
    popularPlans,
  };
}
