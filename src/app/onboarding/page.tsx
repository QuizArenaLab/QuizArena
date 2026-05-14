/**
 * QuizArena — Onboarding Start Page
 *
 * Entry point for the onboarding flow.
 * Placeholder — full UI will be implemented in Phase 5.
 */
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default async function OnboardingPage() {
  // Onboarding start — redirects to first step
  redirect(ROUTES.ONBOARDING.PROFILE_SETUP);
}
