/**
 * QuizArena — Dashboard Layout with App Shell
 *
 * Wraps all authenticated dashboard views with:
 * - Session-verified sidebar navigation
 * - Responsive mobile drawer
 * - Consistent page structure
 * - User identity display
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Ensure that only the designated ADMIN_EMAIL is granted access to see administrative tools/pages.
  // Normal users are forced to go to the onboarding process if not yet completed.
  const adminEmail = process.env.ADMIN_EMAIL || "quizarenadev@gmail.com";
  const isNotAdmin = session.user.email !== adminEmail;

  if (isNotAdmin && !session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
