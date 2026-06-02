"use client";

/**
 * QuizArena — Exam Shell Component
 *
 * Root client component that orchestrates the entire exam experience.
 * Receives serialized data from server component and initializes subsystems.
 */

import { useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useExamStore } from "@/features/exam/store/exam-store";
import { useExamTimer } from "@/features/exam/hooks/useExamTimer";
import { useExamNavigation } from "@/features/exam/hooks/useExamNavigation";
import { useAnswerPersistence } from "@/features/exam/hooks/useAnswerPersistence";
import { useAntiCheat } from "@/features/exam/hooks/useAntiCheat";
import { submitChallenge } from "@/features/challenges/services/challenge";
import { ExamHeader } from "./ExamHeader";
import { QuestionCard } from "./QuestionCard";
import { QuestionPalette } from "./QuestionPalette";
import { MobilePaletteDrawer } from "./MobilePaletteDrawer";
import { SubmitConfirmModal } from "./SubmitConfirmModal";
import { AntiCheatOverlay } from "./AntiCheatOverlay";
import type { ExamInitData } from "@/types/exam";

interface ExamShellProps {
  initData: ExamInitData;
}

export function ExamShell({ initData }: ExamShellProps) {
  const router = useRouter();
  const isOffline = useSyncExternalStore(
    (callback) => {
      window.addEventListener("offline", callback);
      window.addEventListener("online", callback);
      return () => {
        window.removeEventListener("offline", callback);
        window.removeEventListener("online", callback);
      };
    },
    () => !navigator.onLine,
    () => false
  );
  const submitLockRef = useRef(false);

  // ─── Store Initialization ────────────────────────────────────
  const initialize = useExamStore((s) => s.initialize);
  const questions = useExamStore((s) => s.questions);
  const attemptId = useExamStore((s) => s.attemptId);
  const challengeTitle = useExamStore((s) => s.challengeTitle);
  const expiresAt = useExamStore((s) => s.expiresAt);
  const isSubmitting = useExamStore((s) => s.isSubmitting);
  const setSubmitting = useExamStore((s) => s.setSubmitting);
  const showSubmitModal = useExamStore((s) => s.showSubmitModal);
  const setShowSubmitModal = useExamStore((s) => s.setShowSubmitModal);
  const showMobilePalette = useExamStore((s) => s.showMobilePalette);
  const setShowMobilePalette = useExamStore((s) => s.setShowMobilePalette);

  // One-time initialization via effect
  // Derive initialized from store state (no explicit tracking needed)
  const initKey = initData.attemptId;

  useEffect(() => {
    initialize({
      attemptId: initData.attemptId,
      challengeSlug: initData.challengeSlug,
      challengeTitle: initData.challengeTitle,
      questions: initData.questions,
      initialAnswers: initData.initialAnswers,
      expiresAt: new Date(initData.expiresAt).getTime(),
      isFlagged: initData.isFlagged,
      totalViolations: initData.totalViolations,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initKey]);

  // Derived: store is initialized when attemptId is populated
  const initialized = attemptId !== "" && questions.length > 0;

  // ─── Timer ───────────────────────────────────────────────────
  const handleTimerExpire = useCallback(() => {
    // Auto-submit on timer expiration
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSubmitting(true);

    submitChallenge(attemptId).then((result) => {
      if (result.success && result.attempt) {
        router.push(`/dashboard/results/${result.attempt.id}`);
      } else {
        setSubmitting(false);
        submitLockRef.current = false;
      }
    });
  }, [attemptId, router, setSubmitting]);

  const timer = useExamTimer({
    expiresAt,
    onExpire: handleTimerExpire,
    enabled: initialized && !isSubmitting,
  });

  // ─── Navigation ──────────────────────────────────────────────
  const nav = useExamNavigation();

  // ─── Answer Persistence ──────────────────────────────────────
  const { answers, selectAnswer, saveStatus, pendingCount } = useAnswerPersistence();

  // ─── Anti-Cheat ──────────────────────────────────────────────
  const antiCheat = useAntiCheat({
    attemptId,
    enabled: initialized,
  });

  // Network state is handled by useSyncExternalStore above

  // ─── Submit Handler ──────────────────────────────────────────
  const handleSubmitRequest = useCallback(() => {
    setShowSubmitModal(true);
  }, [setShowSubmitModal]);

  const handleConfirmSubmit = useCallback(async () => {
    if (submitLockRef.current || isSubmitting) return;
    submitLockRef.current = true;
    setSubmitting(true);

    try {
      const result = await submitChallenge(attemptId);
      if (result.success && result.attempt) {
        router.push(`/dashboard/results/${result.attempt.id}`);
      } else {
        setSubmitting(false);
        submitLockRef.current = false;
        console.error("Submission failed:", result.error);
      }
    } catch (error) {
      setSubmitting(false);
      submitLockRef.current = false;
      console.error("Submission error:", error);
    }
  }, [attemptId, isSubmitting, router, setSubmitting]);

  const handleReviewUnanswered = useCallback(() => {
    setShowSubmitModal(false);
    nav.goTo(nav.firstUnansweredIndex);
  }, [setShowSubmitModal, nav]);

  // ─── Guard: Not initialized ──────────────────────────────────
  if (!initialized || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Initializing exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[nav.currentIndex];
  const selectedOptionId = currentQuestion ? (answers[currentQuestion.questionId] ?? null) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Anti-Cheat Overlay */}
      <AntiCheatOverlay
        showWarning={antiCheat.showWarning}
        warningMessage={antiCheat.warningMessage}
        onDismissWarning={antiCheat.dismissWarning}
        isFlagged={antiCheat.isFlagged}
        violationCount={antiCheat.violationCount}
        warningLevel={antiCheat.warningLevel}
      />

      {/* Sticky Header */}
      <ExamHeader
        challengeTitle={challengeTitle}
        timerFormatted={timer.formatted}
        timerUrgency={timer.urgency}
        answeredCount={nav.answeredCount}
        totalQuestions={nav.totalQuestions}
        isSubmitting={isSubmitting}
        onSubmitRequest={handleSubmitRequest}
        onToggleMobilePalette={() => setShowMobilePalette(true)}
        saveStatus={saveStatus}
        isOffline={isOffline}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 sm:gap-8">
        {/* Question Area */}
        <div>
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={nav.currentIndex + 1}
              totalQuestions={nav.totalQuestions}
              selectedOptionId={selectedOptionId}
              onSelectOption={selectAnswer}
              onNext={nav.goNext}
              onPrevious={nav.goPrevious}
              isFirst={nav.isFirst}
              isLast={nav.isLast}
              onSubmitRequest={handleSubmitRequest}
            />
          )}
        </div>

        {/* Sidebar Palette (Desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <QuestionPalette
              totalQuestions={nav.totalQuestions}
              getPaletteState={nav.getPaletteState}
              onSelectQuestion={nav.goTo}
              answeredCount={nav.answeredCount}
              unansweredCount={nav.unansweredCount}
              notVisitedCount={nav.notVisitedCount}
            />
          </div>
        </aside>
      </main>

      {/* Mobile Palette Drawer */}
      <MobilePaletteDrawer
        isOpen={showMobilePalette}
        onClose={() => setShowMobilePalette(false)}
        totalQuestions={nav.totalQuestions}
        getPaletteState={nav.getPaletteState}
        onSelectQuestion={nav.goTo}
        answeredCount={nav.answeredCount}
        unansweredCount={nav.unansweredCount}
        notVisitedCount={nav.notVisitedCount}
      />

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        onReviewUnanswered={handleReviewUnanswered}
        totalQuestions={nav.totalQuestions}
        answeredCount={nav.answeredCount}
        unansweredCount={nav.unansweredCount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
