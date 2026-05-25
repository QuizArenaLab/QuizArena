import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/lib/super-admin/governance";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
  const result = await validateSuperAdmin();

  if (!result.authorized) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  redirect(ROUTES.SUPER_ADMIN.HOME);
}
