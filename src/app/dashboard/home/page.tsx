/**
 * QuizArena — Dashboard Home Dispatcher
 * Automatically renders the correct dashboard based on user role.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { ROLES } from "@/lib/rbac/roles";
import { UserDashboardView } from "@/components/dashboard/views/UserDashboard";
import { AdminDashboardView } from "@/components/dashboard/views/AdminDashboard";
import { ModeratorDashboardView } from "@/components/dashboard/views/ModeratorDashboard";
import { SuperAdminDashboardView } from "@/components/dashboard/views/SuperAdminDashboard";

export default async function DashboardHomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const role = session.user.role as string;
  const email = session.user.email;
  const adminEmail = process.env.ADMIN_EMAIL || "quizarenadev@gmail.com";

  if ((role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) && email !== adminEmail) {
    return <UserDashboardView user={session.user} />;
  }

  switch (role) {
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboardView />;
    case ROLES.ADMIN:
      return <AdminDashboardView />;
    case ROLES.MODERATOR:
      return <ModeratorDashboardView />;
    default:
      return <UserDashboardView user={session.user} />;
  }
}
