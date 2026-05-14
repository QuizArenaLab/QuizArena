/**
 * QuizArena — Onboarding: Complete
 *
 * Placeholder for onboarding completion step.
 * Full UI will be implemented in Phase 5.
 */
export default function OnboardingCompletePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-navy mb-2">Onboarding Complete!</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome to QuizArena. Your journey starts now.</p>

        {/* Placeholder — to be implemented properly with marking onboardingComplete in DB */}
        <div className="h-12 bg-primary/10 rounded-lg animate-pulse mb-4" />

        <p className="text-xs text-gray-400">Coming soon — Complete onboarding action</p>
      </div>
    </div>
  );
}
