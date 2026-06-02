import { redirect } from "next/navigation";
import { requireModerator } from "@/features/rbac/services/guards";
import { ROUTES } from '@/constants/routes';

export default async function ModeratorDashboardPage() {
  try {
    await requireModerator("/dashboard");
  } catch {
    redirect("/dashboard");
  }

  redirect(ROUTES.MODERATOR.CHALLENGES);
}
