/**
 * QuizArena — User Application Shell Layout
 *
 * Wraps all authenticated views (Dashboard, Challenges, Analytics, Profile, Settings)
 * with the persistent sidebar navigation and mobile drawer.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { DashboardShell } from "@/shared/layout/DashboardShell";
import { getPerformanceOverview, getCompetitivePosition } from "@/features/analytics/services/performance";
import { prisma } from "@/lib/prisma";

export default async function UserAppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Ensure that only the designated ADMIN_EMAIL or SUPER_ADMIN_EMAIL is granted access to see administrative tools/pages.
  // Normal users are forced to go to the onboarding process if not yet completed.
  const adminEmail = process.env.ADMIN_EMAIL;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const isNotAdmin = session.user.email !== adminEmail && session.user.email !== superAdminEmail;

  if (isNotAdmin && !session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  let currentStreak = 0;
  let currentRank: number | null = null;
  let freshUser = null;

  if (session.user?.id) {
    freshUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { examCategory: true, name: true, image: true, username: true }
    });
  }

  if (isNotAdmin && session.user.id) {
    const performance = await getPerformanceOverview(session.user.id);
    const position = await getCompetitivePosition(session.user.id);
    if (performance) currentStreak = performance.currentStreak;
    if (position) currentRank = position.globalRank;
  }

  return (
    <DashboardShell currentStreak={currentStreak} currentRank={currentRank} freshUser={freshUser}>
      {children}
    </DashboardShell>
  );
}
