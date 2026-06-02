/**
 * QuizArena — Dashboard Home Dispatcher
 * Automatically renders the correct dashboard based on user role.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { ROLE as ROLES } from "@/features/rbac/constants/role-types";
import { UserDashboardView } from "@/features/dashboard/components/user/UserDashboard";
import { AdminDashboardView } from "@/features/dashboard/components/admin/AdminDashboard";
import { ModeratorDashboardView } from "@/features/dashboard/components/moderator/ModeratorDashboard";
import { SuperAdminDashboardView } from "@/features/dashboard/components/super-admin/SuperAdminDashboard";

export default async function DashboardHomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const role = session.user.role as string;
  const email = session.user.email;
  const adminEmail = process.env.ADMIN_EMAIL;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

  if (role === ROLES.SUPER_ADMIN && email !== superAdminEmail) {
    return <UserDashboardView user={session.user} />;
  }
  if (role === ROLES.ADMIN && email !== adminEmail && email !== superAdminEmail) {
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
