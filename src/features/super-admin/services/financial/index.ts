import { prisma } from "@/lib/prisma";
import { assertSuperAdmin } from "@/features/super-admin/services/governance";
import type { SovereignAlert } from "@/types/super-admin-dashboard";

/**
 * Ensures strict isolation. This is the financial sovereignty layer.
 * MUST be called before ANY financial data is calculated.
 */
async function protectFinancialData() {
  await assertSuperAdmin();
}

// ─── Financial Aggregation Utilities ───────────────────────────────────────

export async function getRevenueOverview() {
  await protectFinancialData();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  // Server-authoritative calculation
  const [
    currentMonthTransactions,
    previousMonthTransactions,
    activeSubscriptions,
    totalTransactions,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.userSubscription.count({
      where: { status: "ACTIVE" },
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  const currentRevenue = currentMonthTransactions._sum.amount || 0;
  const previousRevenue = previousMonthTransactions._sum.amount || 0;
  const totalRevenue = totalTransactions._sum.amount || 0;

  let growthRate = 0;
  if (previousRevenue > 0) {
    growthRate = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  } else if (currentRevenue > 0) {
    growthRate = 100;
  }

  // Monthly Recurring Revenue (MRR) - approximated by active subscriptions * average plan value
  const mrrQuery = await prisma.userSubscription.count({
    where: { status: "ACTIVE" },
  });
  // Note: MRR approximation for demo
  const mrr = mrrQuery * 10;

  return {
    totalRevenue,
    monthlyRevenue: currentRevenue,
    mrr,
    activeSubscriptions,
    growthRate: Math.round(growthRate * 10) / 10,
  };
}

export async function getSubscriptionMetrics() {
  await protectFinancialData();

  const [active, canceled, pastDue, expired] = await Promise.all([
    prisma.userSubscription.count({ where: { status: "ACTIVE" } }),
    prisma.userSubscription.count({ where: { status: "CANCELLED" } }),
    0, // pastDue not supported natively yet
    prisma.userSubscription.count({ where: { status: "EXPIRED" } }),
  ]);

  const total = active + canceled + pastDue + expired;
  const churnRate = total > 0 ? (canceled / total) * 100 : 0;

  return {
    active,
    canceled,
    pastDue,
    expired,
    total,
    churnRate: Math.round(churnRate * 10) / 10,
  };
}

export async function getTransactionHealth() {
  await protectFinancialData();

  const [completed, pending, failed, refunded] = await Promise.all([
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.transaction.count({ where: { status: "PENDING" } }),
    prisma.transaction.count({ where: { status: "FAILED" } }),
    prisma.transaction.count({ where: { status: "REFUNDED" } }),
  ]);

  const total = completed + pending + failed + refunded;
  const failureRate = total > 0 ? (failed / total) * 100 : 0;

  return {
    completed,
    pending,
    failed,
    refunded,
    total,
    failureRate: Math.round(failureRate * 10) / 10,
  };
}

export async function getFinancialAlerts(): Promise<SovereignAlert[]> {
  await protectFinancialData();

  const alerts: SovereignAlert[] = [];
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [recentFailures, recentCancellations] = await Promise.all([
    prisma.transaction.count({
      where: { status: "FAILED", createdAt: { gte: twentyFourHoursAgo } },
    }),
    prisma.userSubscription.count({
      where: { status: "CANCELLED", canceledAt: { gte: twentyFourHoursAgo } },
    }),
  ]);

  if (recentFailures > 10) {
    alerts.push({
      id: "fin-alert-failures",
      title: "Elevated Payment Failures",
      description: `${recentFailures} transactions failed in the last 24 hours.`,
      severity: recentFailures > 50 ? "CRITICAL" : "WARNING",
      timestamp: new Date(),
      category: "OPERATIONS",
    });
  }

  if (recentCancellations > 5) {
    alerts.push({
      id: "fin-alert-churn",
      title: "Anomalous Subscription Churn",
      description: `${recentCancellations} subscriptions were canceled in the last 24 hours.`,
      severity: "WARNING",
      timestamp: new Date(),
      category: "OPERATIONS",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "fin-alert-ok",
      title: "Financial Systems Nominal",
      description: "No anomalies detected in the financial operations layer.",
      severity: "INFO",
      timestamp: new Date(),
      category: "INFRASTRUCTURE",
    });
  }

  return alerts;
}

export async function generateBusinessInsights() {
  await protectFinancialData();

  // Basic implementation for intelligence layer. Can be scaled dramatically.
  const revenueData = await getRevenueOverview();
  const subMetrics = await getSubscriptionMetrics();
  const txHealth = await getTransactionHealth();

  let revenueHealth = "STABLE";
  if (revenueData.growthRate > 10) revenueHealth = "STRONG";
  if (revenueData.growthRate < -5) revenueHealth = "DECLINING";

  let churnHealth = "STABLE";
  if (subMetrics.churnRate > 10) churnHealth = "CRITICAL";
  if (subMetrics.churnRate < 5) churnHealth = "EXCELLENT";

  return {
    revenueHealth,
    churnHealth,
    transactionReliability: txHealth.failureRate < 2 ? "STRONG" : "NEEDS_ATTENTION",
    recommendation:
      revenueHealth === "DECLINING"
        ? "Investigate recent pricing changes or marketing funnel drops."
        : churnHealth === "CRITICAL"
          ? "High priority: analyze cancellation reasons to reduce churn."
          : "Operations nominal. Focus on top-of-funnel acquisition.",
  };
}
