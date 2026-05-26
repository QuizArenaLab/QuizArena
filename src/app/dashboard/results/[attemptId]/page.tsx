"use client";

import { useEffect, useState } from "react";
import { getAttemptById } from "@/actions/challenge";
import { getUserChallengeRank } from "@/actions/leaderboard";
import type { QuestionResult } from "@/types/challenge";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BarChart3,
  ArrowRight,
  RotateCcw,
  Medal,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const [attempt, setAttempt] = useState<{
    id: string;
    challengeId: string;
    challenge: {
      title: string;
      totalQuestions: number;
      status: string;
      questions: {
        questionId: string;
        question: {
          options: { id: string; optionText: string; isCorrect: boolean }[];
          explanation: string | null;
        };
      }[];
    };
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    score: number;
    timeTakenInSeconds: number | null;
    answers: {
      questionId: string;
      selectedOptionId: string | null;
      selectedOption: string | null;
      isCorrect: boolean | null;
    }[];
  } | null>(null);
  const [rankData, setRankData] = useState<{
    rank: number;
    totalParticipants: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      const { attemptId } = await params;

      const result = (await getAttemptById(attemptId)) as any;

      if (!result) {
        setError("Result not found");
      } else {
        setAttempt(result);

        // Load rank data if challenge has ended
        if (result.challenge.status === "ENDED" || result.challenge.status === "ARCHIVED") {
          const rank = await getUserChallengeRank(result.challengeId);
          setRankData(rank);
        }
      }

      setIsLoading(false);
    };

    loadResult();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Result Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn&apos;t find this result.</p>
          <button
            onClick={() => (window.location.href = "/challenges")}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const accuracy =
    attempt.challenge.totalQuestions > 0
      ? Math.round((attempt.correctAnswers / attempt.challenge.totalQuestions) * 100)
      : 0;

  const timeTaken = attempt.timeTakenInSeconds || 0;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return "Outstanding Performance";
    if (accuracy >= 60) return "Strong Performance";
    if (accuracy >= 40) return "Moderate Performance";
    return "Keep Practicing";
  };

  const questions: QuestionResult[] = attempt.challenge.questions.map((cq) => {
    const answer = attempt.answers.find((a) => a.questionId === cq.questionId);
    const correctOption = cq.question.options.find((o) => o.isCorrect);
    return {
      questionId: cq.questionId,
      selectedOption: answer?.selectedOption || null,
      correctOption: correctOption?.optionText || "",
      isCorrect: answer?.isCorrect || false,
    };
  });

  const challengeEnded =
    attempt.challenge.status === "ENDED" || attempt.challenge.status === "ARCHIVED";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ─── Score Card ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
              {getPerformanceMessage()}
            </h1>
            <p className="text-gray-500">{attempt.challenge.title}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-navy">{attempt.score}</p>
              <p className="text-xs text-gray-500 mt-1">Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{attempt.correctAnswers}</p>
              <p className="text-xs text-green-600 mt-1">Correct</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-3xl font-bold text-red-600">{attempt.wrongAnswers}</p>
              <p className="text-xs text-red-600 mt-1">Wrong</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-navy">{accuracy}%</p>
              <p className="text-xs text-gray-500 mt-1">Accuracy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time Taken</p>
                <p className="font-bold text-navy">
                  {minutes}m {seconds}s
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Target className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-bold text-navy">{attempt.challenge.totalQuestions} total</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Leaderboard Rank Card ───────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-navy">Your Ranking</h2>
          </div>

          {challengeEnded ? (
            rankData ? (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-700">#{rankData.rank}</span>
                  </div>
                  <div>
                    <p className="font-bold text-navy">
                      Rank {rankData.rank} of {rankData.totalParticipants}
                    </p>
                    <p className="text-sm text-gray-500">
                      {rankData.rank <= 3
                        ? "🏆 Top performer!"
                        : rankData.rank <= Math.ceil(rankData.totalParticipants * 0.1)
                          ? "Top 10% — Great job!"
                          : rankData.rank <= Math.ceil(rankData.totalParticipants * 0.25)
                            ? "Top 25% — Well done!"
                            : "Keep practicing to improve your rank"}
                    </p>
                  </div>
                </div>
                <a
                  href={`/leaderboard?challenge=${attempt.challengeId}`}
                  className="text-primary font-medium text-sm hover:underline"
                >
                  View Full Leaderboard
                </a>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Leaderboard data not available for this challenge.
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Lock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-navy">
                  Rankings will be revealed when the challenge ends
                </p>
                <p className="text-sm text-gray-500">
                  Your score has been recorded. Check back after the challenge window closes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─── Attempt Summary ─────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-navy" />
            <h2 className="text-lg font-bold text-navy">Attempt Summary</h2>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.questionId}
                onClick={() => setSelectedQuestion(selectedQuestion === idx ? null : idx)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors text-left",
                  selectedQuestion === idx
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      q.isCorrect
                        ? "bg-green-100 text-green-600"
                        : q.selectedOption
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {q.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : q.selectedOption ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </span>
                  <span className="text-sm text-navy font-medium">Question {idx + 1}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    q.isCorrect
                      ? "text-green-600"
                      : q.selectedOption
                        ? "text-red-600"
                        : "text-gray-400"
                  )}
                >
                  {q.isCorrect
                    ? "Correct"
                    : q.selectedOption
                      ? `Your answer: ${q.selectedOption}`
                      : "Unanswered"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Actions ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/challenges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Attempt Another Challenge
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-navy font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
