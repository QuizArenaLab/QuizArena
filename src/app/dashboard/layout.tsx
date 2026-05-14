/**
 * QuizArena — Protected Dashboard Layout (Wrapper)
 *
 * This wraps the dashboard in the ProtectedAppLayout.
 * All authenticated pages go inside /dashboard/(.) route group.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { ProtectedAppLayout } from "@/components/layout/ProtectedAppLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  return <ProtectedAppLayout session={session}>{children}</ProtectedAppLayout>;
}
