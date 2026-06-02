/**
 * QuizArena — Challenge Attempt Page (Server Component)
 *
 * Authenticates user, starts or resumes an attempt,
 * constructs serializable exam data, and renders ExamShell.
 *
 * All attempt logic is server-authoritative.
 * ExamShell receives only sanitized, client-safe data.
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { ROUTES } from '@/constants/routes';
import { startChallenge, getAttemptAnswers } from "@/actions/challenge";
import { ExamShell } from "@/components/exam/ExamShell";
import type { ExamInitData, ExamQuestion } from "@/types/exam";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Challenge Exam | QuizArena",
  description: "Take the competitive challenge on QuizArena.",
};

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;

  // 1. Authenticate
  const session = await auth();
  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // 2. Start or resume attempt (server-authoritative)
  const result = await startChallenge(slug);

  // 3. Handle errors / redirects
  if (!result.success) {
    // Already submitted — redirect to results
    if (result.existingAttempt?.submittedAt) {
      redirect(`/dashboard/results/${result.existingAttempt.id}`);
    }

    // Other errors
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Unable to Start Challenge</h2>
          <p className="text-slate-400 mb-6">
            {result.error || "Something went wrong. Please try again."}
          </p>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  if (!result.challenge || !result.attemptId) {
    redirect("/challenges");
  }

  // 4. Calculate timer expiration
  const attempt = result.existingAttempt;
  const durationMs = result.challenge.durationInMinutes * 60 * 1000;
  let expiresAt: string;

  if (attempt?.startedAt) {
    const startTime = new Date(attempt.startedAt).getTime();
    expiresAt = new Date(startTime + durationMs).toISOString();
  } else {
    const now = new Date();
    expiresAt = new Date(now.getTime() + durationMs).toISOString();
  }

  // 5. Build serializable exam questions
  const examQuestions: ExamQuestion[] = result.challenge.questions.map((q) => ({
    questionId: q.questionId,
    question: q.question,
    options: q.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      displayLabel: opt.displayLabel,
    })),
    order: q.order,
  }));

  // 6. Fetch existing answers for recovery
  let initialAnswers: Record<string, string | null> = {};
  if (attempt) {
    const savedAnswers = await getAttemptAnswers(result.attemptId);
    initialAnswers = savedAnswers;
  }

  // 7. Build init data
  const initData: ExamInitData = {
    attemptId: result.attemptId,
    challengeSlug: slug,
    challengeTitle: result.challenge.title,
    questions: examQuestions,
    initialAnswers,
    expiresAt,
    isFlagged: attempt?.isFlagged ?? false,
    totalViolations: attempt?.totalViolations ?? 0,
  };

  return <ExamShell initData={initData} />;
}
