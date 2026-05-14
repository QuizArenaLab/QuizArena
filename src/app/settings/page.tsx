/**
 * QuizArena — Settings Page
 *
 * Placeholder for user settings.
 * Protected route — requires authentication.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-navy mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Email:</span>{" "}
              {session.user.email || "Not provided"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Name:</span>{" "}
              {session.user.name || "Not set"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Role:</span> {session.user.role || "USER"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Onboarding:</span>{" "}
              {session.user.onboardingCompleted ? "Complete ✅" : "Pending ⏳"}
            </p>
          </div>
        </div>

        {/* Placeholder for future settings controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Preferences</h2>
          <p className="text-gray-500 text-sm">Notification and display preferences coming soon.</p>
        </div>
      </div>
    </div>
  );
}
