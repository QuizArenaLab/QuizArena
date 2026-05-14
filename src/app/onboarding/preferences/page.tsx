/**
 * QuizArena — Onboarding: Preferences
 *
 * Placeholder for preferences setup step.
 * Full UI will be implemented in Phase 5.
 */
export default async function PreferencesPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-navy mb-2">Preferences</h1>
        <p className="text-gray-500 text-sm mb-6">
          Tell us what subjects you&apos;re preparing for.
        </p>

        {/* Placeholder — to be implemented in Phase 5 */}
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">Coming soon — Preferences form</p>
      </div>
    </div>
  );
}
