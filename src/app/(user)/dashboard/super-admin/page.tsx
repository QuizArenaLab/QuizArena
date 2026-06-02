import { redirect } from "next/navigation";
import { validateSuperAdmin } from "@/features/super-admin/services/governance";
import { ROUTES } from '@/constants/routes';

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
  const result = await validateSuperAdmin();

  if (!result.authorized) {
    redirect(ROUTES.PROTECTED.DASHBOARD);
  }

  redirect(ROUTES.SUPER_ADMIN.HOME);
}
