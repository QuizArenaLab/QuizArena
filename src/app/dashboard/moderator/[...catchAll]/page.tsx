import { redirect } from "next/navigation";

/**
 * QuizArena Moderator Catch-All Route
 * Automatically redirects unmatched moderator routes back to the Moderator Dashboard.
 */
export default function ModeratorCatchAllPage() {
  redirect("/dashboard/moderator");
}
