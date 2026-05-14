/**
 * QuizArena — Dashboard Entry Point
 *
 * Redirects to the default dashboard home view.
 * All dashboard sub-routes are handled by /dashboard/[route]/page.tsx
 */
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function DashboardPage() {
  redirect(ROUTES.PROTECTED.DASHBOARD);
}
