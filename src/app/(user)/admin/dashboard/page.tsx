import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ROLE as ROLES } from "@/features/rbac/constants/role-types";
import { AdminDashboardView } from "@/features/dashboard/components/admin/AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const role = session.user.role as string;
  const email = session.user.email;
  const adminEmail = process.env.ADMIN_EMAIL;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

  if (role !== ROLES.ADMIN && email !== adminEmail && email !== superAdminEmail) {
    redirect("/dashboard/home");
  }

  return <AdminDashboardView />;
}
