/**
 * QuizArena — Protected Application Layout
 *
 * This layout wraps all protected routes and provides:
 * - Session-aware navigation
 * - User identity display
 * - Global logout action
 * - Consistent SaaS-grade shell
 * - Mobile-safe interactions
 */
import { getServerSession } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { ProtectedAppLayout } from "@/shared/layout/ProtectedAppLayout";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Server-side session retrieval — no flicker, always fresh
  const session = await getServerSession();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  return <ProtectedAppLayout session={session}>{children}</ProtectedAppLayout>;
}
