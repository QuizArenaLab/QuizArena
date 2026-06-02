import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { hasMinimumRole } from "@/features/rbac/constants/role-hierarchy";
import { ROLE } from "@/features/rbac/constants/role-types";
import {
  getDashboardOverview,
  getChallengePerformanceMetrics,
  getQuestionAnalytics,
  getEngagementTrends,
  getDifficultyInsights,
  getCategoryAnalytics,
  generateInsights,
} from "@/features/analytics/services/analytics";
import { AnalyticsDashboardClient } from "./AnalyticsDashboardClient";

async function getAnalyticsData() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userRole = (session.user.role as string) || "USER";
  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    redirect("/dashboard");
  }

  try {
    const [
      overview,
      challengeMetrics,
      questionAnalytics,
      trends,
      difficultyInsights,
      categoryAnalytics,
      insights,
    ] = await Promise.all([
      getDashboardOverview(),
      getChallengePerformanceMetrics({}),
      getQuestionAnalytics({}),
      getEngagementTrends("monthly"),
      getDifficultyInsights(),
      getCategoryAnalytics(),
      generateInsights(),
    ]);

    return {
      overview,
      challengeMetrics,
      questionAnalytics,
      trends: trends.map((t) => ({ date: t.date, value: t.attempts, label: t.date })),
      difficultyInsights,
      categoryAnalytics,
      insights,
    };
  } catch (error) {
    console.error("Failed to load analytics:", error);
    return null;
  }
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-500">Unable to load analytics data</p>
      </div>
    );
  }

  return <AnalyticsDashboardClient data={analyticsData} />;
}
