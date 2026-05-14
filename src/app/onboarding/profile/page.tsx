/**
 * QuizArena — Onboarding: Profile Setup
 *
 * Placeholder for profile setup step.
 * Full UI will be implemented in Phase 5.
 */
export default async function ProfileSetupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-navy mb-2">Set Up Your Profile</h1>
        <p className="text-gray-500 text-sm mb-6">
          Complete your profile to get started with QuizArena.
        </p>

        {/* Placeholder form — to be implemented with actual form in Phase 5 */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-12 bg-primary/10 rounded-lg animate-pulse" />
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">Coming soon — Profile setup form</p>
      </div>
    </div>
  );
}
