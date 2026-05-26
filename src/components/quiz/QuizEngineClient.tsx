"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveAnswer, submitAttempt } from "@/actions/quiz-engine";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { QuestionNavigator } from "./QuestionNavigator";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Send, ShieldAlert } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { id: string; optionText: string }[];
}

interface QuizEngineClientProps {
  attemptId: string;
  challengeSlug: string;
  expiresAt: string;
  questions: Question[];
  initialAnswers: Record<string, string>;
  isFlagged: boolean;
}

export function QuizEngineClient({
  attemptId,
  challengeSlug,
  expiresAt,
  questions,
  initialAnswers,
  isFlagged: initialFlagged,
}: QuizEngineClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const expirationTime = new Date(expiresAt).getTime();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Anti-cheat hook integration
  const { isFlagged } = useAntiCheat({
    attemptId,
    onViolation: (type) => {
      let msg = "";
      if (type === "TAB_SWITCH") msg = "Tab switching is not allowed during the exam!";
      if (type === "WINDOW_BLUR") msg = "Please keep focus on the exam window!";
      if (type === "COPY_ATTEMPT") msg = "Copying content is disabled.";
      if (type === "RIGHT_CLICK") msg = "Right-click is disabled.";

      setWarningMessage(msg);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    },
  });

  const submitExam = useCallback(
    async (autoSubmit = false) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await submitAttempt(attemptId, autoSubmit);
        router.push(`/challenges/${challengeSlug}/result`);
      } catch (error) {
        console.error("Submission failed", error);
        setIsSubmitting(false);
      }
    },
    [attemptId, challengeSlug, isSubmitting, router]
  );

  // Global Timer logic
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        submitExam(true); // Auto-submit when time is up
      }
    };

    updateTimer(); // Initial call
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expirationTime, submitExam]);

  const handleSelectOption = async (optionId: string) => {
    const questionId = questions[currentQuestionIndex].id;

    // Optimistic UI update
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Persist to server
    try {
      await saveAnswer(attemptId, questionId, optionId);
    } catch (error) {
      console.error("Failed to save answer", error);
      // Could show a toast notification for save failure
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isDangerTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            QA
          </div>
          <span className="font-semibold tracking-tight text-white">QuizArena Engine</span>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold transition-colors",
              isDangerTime
                ? "bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse"
                : "bg-slate-800 text-emerald-400 border border-slate-700"
            )}
          >
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => submitExam(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send size={18} />
                Submit Exam
              </>
            )}
          </button>
        </div>
      </header>

      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg shadow-red-500/20 flex items-center gap-3 font-medium">
            <ShieldAlert size={20} />
            {warningMessage}
          </div>
        </div>
      )}

      {(isFlagged || initialFlagged) && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center justify-center gap-2 text-red-400 text-sm font-medium">
          <AlertCircle size={16} />
          Multiple violations detected. Your attempt has been flagged for review.
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Question Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
            <h2 className="text-xl font-medium text-slate-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <div className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider rounded-md">
              Single Choice
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-2xl leading-relaxed font-medium text-slate-100">
              {currentQuestion.question}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border transition-all duration-200 flex items-center gap-4 group",
                    isSelected
                      ? "bg-blue-600/10 border-blue-500 text-blue-100 ring-1 ring-blue-500/50"
                      : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm transition-colors",
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-600 text-slate-400 group-hover:border-slate-500"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg">{option.optionText}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
              }
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            questionIds={questions.map((q) => q.id)}
            onSelectQuestion={setCurrentQuestionIndex}
          />
        </aside>
      </main>
    </div>
  );
}
