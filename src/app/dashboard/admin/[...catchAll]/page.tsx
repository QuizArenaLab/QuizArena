import { redirect } from "next/navigation";

/**
 * QuizArena Admin Catch-All Route
 * Automatically redirects unmatched admin routes back to the Admin Operational Dashboard.
 */
export default function AdminCatchAllPage() {
  redirect("/dashboard/admin");
}
