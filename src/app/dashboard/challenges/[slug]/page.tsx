"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  startChallenge,
  saveAnswer,
  submitChallenge,
  getAttemptAnswers,
} from "@/actions/challenge";
import { reportViolations } from "@/actions/anti-cheat";
import type {
  ChallengeWithQuestionsForAttempt,
  QuizAnswerState,
  ViolationType,
  AntiCheatState,
} from "@/types/challenge";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizPageProps {
  params: Promise<{ slug: string }>;
}

interface TimerState {
  remainingSeconds: number;
  isExpired: boolean;
}

// ─── Anti-Cheat Constants ────────────────────────────────────────
const VIOLATION_WARNING_THRESHOLD = 3;
const VIOLATION_CRITICAL_THRESHOLD = 6;
const VIOLATION_REPORT_INTERVAL_MS = 30_000; // Report violations every 30 seconds

export default function QuizPage({ params }: QuizPageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // ─── Core State ──────────────────────────────────────────────
  const [challenge, setChallenge] = useState<ChallengeWithQuestionsForAttempt | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<TimerState>({ remainingSeconds: 0, isExpired: false });
  const [initialized, setInitialized] = useState(false);

  // ─── Anti-Cheat State ────────────────────────────────────────
  const [antiCheat, setAntiCheat] = useState<AntiCheatState>({
    violations: { TAB_SWITCH: 0, WINDOW_BLUR: 0, COPY_ATTEMPT: 0, RIGHT_CLICK: 0 },
    totalViolations: 0,
    warningShown: false,
    criticalWarningShown: false,
  });
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const pendingViolationsRef = useRef<Record<ViolationType, number[]>>({
    TAB_SWITCH: [],
    WINDOW_BLUR: [],
    COPY_ATTEMPT: [],
    RIGHT_CLICK: [],
  });

  // ─── Network State ──────────────────────────────────────────
  const [isOffline, setIsOffline] = useState(false);
  const saveQueueRef = useRef<{ questionId: string; selectedOptionId: string | null }[]>([]);

  // ─── Refs ────────────────────────────────────────────────────
  const submitRef = useRef<() => Promise<void> | undefined>(undefined);

  // ─── Flush Violations ────────────────────────────────────────
  const flushViolations = useCallback(async (currentAttemptId: string) => {
    const violations: { type: ViolationType; count: number; timestamps: number[] }[] = [];

    for (const type of Object.keys(pendingViolationsRef.current) as ViolationType[]) {
      const timestamps = pendingViolationsRef.current[type];
      if (timestamps.length > 0) {
        violations.push({
          type,
          count: timestamps.length,
          timestamps: [...timestamps],
        });
        pendingViolationsRef.current[type] = [];
      }
    }

    if (violations.length > 0) {
      try {
        await reportViolations(currentAttemptId, violations);
      } catch {
        // Re-queue if failed
        for (const v of violations) {
          pendingViolationsRef.current[v.type].push(...v.timestamps);
        }
      }
    }
  }, []);

  // ─── Submit Handler ──────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!attemptId || isSubmitting) return;

    setIsSubmitting(true);

    // Flush any pending violations before submission
    if (attemptId) {
      flushViolations(attemptId);
    }

    const result = await submitChallenge(attemptId);

    if (result.success && result.attempt) {
      router.push(`/dashboard/results/${result.attempt.id}`);
    } else {
      setError(result.error || "Failed to submit challenge");
      setIsSubmitting(false);
    }
  }, [attemptId, isSubmitting, router, flushViolations]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  // ─── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized || timer.isExpired || isLoading) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          if (submitRef.current) {
            submitRef.current();
          }
          return { ...prev, remainingSeconds: 0, isExpired: true };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialized, timer.isExpired, isLoading]);

  // ─── Initialization ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (cancelled) return;

      setIsLoading(true);
      setError(null);

      const result = await startChallenge(slug);

      if (cancelled) return;

      if (!result.success) {
        // Check if this is an auto-submit redirect
        if (result.existingAttempt && result.existingAttempt.submittedAt) {
          router.push(`/dashboard/results/${result.existingAttempt.id}`);
          return;
        }
        setError(result.error || "Failed to load challenge");
        setIsLoading(false);
        return;
      }

      if (result.challenge && result.attemptId) {
        setChallenge(result.challenge);
        setAttemptId(result.attemptId);

        const duration = result.challenge.durationInMinutes * 60;

        if (result.existingAttempt && result.existingAttempt.startedAt) {
          // Resuming existing attempt — recalculate timer from server time
          const startTime = new Date(result.existingAttempt.startedAt).getTime();
          const currentTime = Date.now();
          const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
          const remainingSeconds = Math.max(0, duration - elapsedSeconds);

          setTimer({ remainingSeconds, isExpired: remainingSeconds <= 0 });

          if (remainingSeconds <= 0) {
            // Timer expired while user was away — auto-submit already handled server-side
            router.push(`/dashboard/results/${result.existingAttempt.id}`);
            return;
          }

          // Restore saved answers
          const existingAnswers = await getAttemptAnswers(result.attemptId);
          if (Object.keys(existingAnswers).length > 0) {
            setAnswers(existingAnswers);
          }
        } else {
          setTimer({ remainingSeconds: duration, isExpired: false });
        }
      }

      setIsLoading(false);
      setInitialized(true);
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  // ─── Anti-Cheat: Violation Detection ─────────────────────────
  const recordViolation = useCallback((type: ViolationType) => {
    const now = Date.now();
    pendingViolationsRef.current[type].push(now);

    setAntiCheat((prev) => {
      const newViolations = { ...prev.violations };
      newViolations[type]++;
      const newTotal = prev.totalViolations + 1;

      let message = "";
      if (newTotal >= VIOLATION_CRITICAL_THRESHOLD && !prev.criticalWarningShown) {
        message = "⚠️ Multiple tab switches detected. Your attempt has been flagged for review.";
        return {
          violations: newViolations,
          totalViolations: newTotal,
          warningShown: true,
          criticalWarningShown: true,
        };
      } else if (newTotal >= VIOLATION_WARNING_THRESHOLD && !prev.warningShown) {
        message = "⚠️ Switching tabs during a challenge is monitored. Please stay on this page.";
        return {
          violations: newViolations,
          totalViolations: newTotal,
          warningShown: true,
          criticalWarningShown: prev.criticalWarningShown,
        };
      }

      if (message) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          setWarningMessage(message);
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 5000);
        }, 0);
      }

      return {
        ...prev,
        violations: newViolations,
        totalViolations: newTotal,
      };
    });
  }, []);

  // Anti-cheat event listeners
  useEffect(() => {
    if (!initialized || !attemptId) return;

    // Tab switch / visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("TAB_SWITCH");
      }
    };

    // Window blur/focus detection
    const handleBlur = () => {
      recordViolation("WINDOW_BLUR");
    };

    // Copy restriction
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation("COPY_ATTEMPT");
    };

    // Cut restriction
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation("COPY_ATTEMPT");
    };

    // Right-click restriction
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation("RIGHT_CLICK");
    };

    // Beforeunload — show browser-native "Leave page?" confirmation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Periodic violation flush
    const flushInterval = setInterval(() => {
      flushViolations(attemptId);
    }, VIOLATION_REPORT_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(flushInterval);
    };
  }, [initialized, attemptId, recordViolation, flushViolations]);

  // ─── Network: Offline/Online Detection ────────────────────────
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      // Flush queued saves on reconnection
      if (attemptId && saveQueueRef.current.length > 0) {
        const queue = [...saveQueueRef.current];
        saveQueueRef.current = [];
        for (const item of queue) {
          saveAnswer(attemptId, item.questionId, item.selectedOptionId).catch(() => {
            saveQueueRef.current.push(item);
          });
        }
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [attemptId]);

  // CSS to prevent text selection
  useEffect(() => {
    if (!initialized) return;
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    return () => {
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, [initialized]);

  // ─── Answer Selection Handler ─────────────────────────────────
  const handleSelectAnswer = async (optionId: string) => {
    if (!attemptId || !challenge) return;

    const question = challenge.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [question.questionId]: optionId };
    setAnswers(newAnswers);

    // Save answer — queue if offline
    try {
      await saveAnswer(attemptId, question.questionId, optionId);
    } catch {
      saveQueueRef.current.push({
        questionId: question.questionId,
        selectedOptionId: optionId,
      });
    }
  };

  // ─── Time Formatter ──────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── Render: Loading ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading challenge...</p>
        </div>
      </div>
    );
  }

  // ─── Render: Error ───────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/challenges")}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  if (!challenge || !attemptId) {
    return null;
  }

  const currentQuestion = challenge.questions[currentQuestionIndex];
  const totalQuestions = challenge.questions.length;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 select-none">
      {/* ─── Offline Banner ──────────────────────────────────── */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-60 bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Connection lost — answers will be saved when you&apos;re back online
        </div>
      )}

      {/* ─── Anti-Cheat Warning Toast ────────────────────────── */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-60 max-w-sm bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* ─── Header ──────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky z-50 bg-white border-b border-gray-200 shadow-sm",
          isOffline ? "top-8" : "top-0"
        )}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-navy">{challenge.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
                timer.remainingSeconds <= 60
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : timer.remainingSeconds <= 300
                    ? "bg-amber-50 text-amber-600"
                    : "bg-navy text-white"
              )}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timer.remainingSeconds)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{answeredCount} answered</span>
              <span>{totalQuestions - answeredCount} remaining</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Question Content ────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="mb-6">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-3">
              Question {currentQuestionIndex + 1}
            </span>
            <p className="text-base sm:text-lg text-navy font-medium leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options — rendered in server-shuffled order */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.questionId] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-navy"
                      : "border-gray-200 hover:border-gray-300 text-navy"
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {option.displayLabel}
                  </span>
                  <span className="text-sm sm:text-base">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Navigation ──────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-navy font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Question palette */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {challenge.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                  idx === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[q.questionId]
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.min(totalQuestions - 1, i + 1))}
              className="flex items-center gap-2 px-4 py-2 text-navy font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Challenge"}
            </button>
          )}
        </div>

        {/* ─── Anti-Cheat Status (subtle) ────────────────────── */}
        {antiCheat.totalViolations > 0 && (
          <div className="mt-4 text-center">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                antiCheat.totalViolations >= VIOLATION_CRITICAL_THRESHOLD
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-600"
              )}
            >
              <AlertTriangle className="w-3 h-3" />
              {antiCheat.totalViolations} violation{antiCheat.totalViolations !== 1 ? "s" : ""}{" "}
              detected
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
