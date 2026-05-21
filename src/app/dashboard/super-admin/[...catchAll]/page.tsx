import { redirect } from "next/navigation";

/**
 * QuizArena Super Admin Catch-All Route
 * Automatically redirects unmatched super-admin routes back to the Super Admin Dashboard.
 */
export default function SuperAdminCatchAllPage() {
  redirect("/dashboard/super-admin");
}
