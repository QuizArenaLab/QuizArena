/**
 * QuizArena — User Application Shell Layout
 *
 * Wraps all authenticated views (Dashboard, Challenges, Analytics, Profile, Settings)
 * with the persistent sidebar navigation and mobile drawer.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { WorkspaceShell } from "@/shared/layout/WorkspaceShell";
import { Suspense } from "react";
import { UserStats } from "@/shared/layout/UserStats";
import { UserStatsSkeleton } from "@/shared/layout/UserStatsSkeleton";
import { ProfileService } from "@/features/user/services/profile.service";

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

  if (isNotAdmin && session.user.onboardingCompleted !== true) {
    redirect("/onboarding");
  }

  let freshUser = null;

  if (session.user?.id) {
    freshUser = await ProfileService.getShellProfile(session.user.id);
  }

  return (
    <WorkspaceShell
      freshUser={freshUser}
      userStatsNode={
        isNotAdmin && session.user.id ? (
          <Suspense fallback={<UserStatsSkeleton />}>
            <UserStats userId={session.user.id} />
          </Suspense>
        ) : null
      }
    >
      {children}
    </WorkspaceShell>
  );
}
