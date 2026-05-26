import { redirect } from "next/navigation";
import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { startAttempt } from "@/actions/quiz-engine";
import { QuizEngineClient } from "@/components/quiz/QuizEngineClient";

export const metadata = {
  title: "Attempt Challenge | QuizArena",
};

interface AttemptPageProps {
  params: { slug: string };
}

export default async function AttemptPage({ params }: AttemptPageProps) {
  // 1. Authenticate user
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/challenges/${params.slug}/attempt`);
  }

  // 2. Fetch challenge details
  const challenge = await prisma.challenge.findUnique({
    where: { slug: params.slug },
    include: {
      questions: {
        include: { question: { include: { options: true } } },
      },
    },
  });

  if (!challenge) {
    redirect("/challenges");
  }

  // 3. Start or recover attempt via Server Action logic
  let attempt;
  try {
    attempt = await startAttempt(session.user.id, challenge.id);
  } catch (error: unknown) {
    // If error says already submitted, redirect to result
    if (error instanceof Error && error.message.includes("already submitted")) {
      redirect(`/challenges/${challenge.slug}/result`);
    }
    // Otherwise go back to challenge detail
    redirect(`/challenges/${challenge.slug}`);
  }

  // 4. Fetch the fully initialized attempt with current answers if recovering
  const activeAttempt = await prisma.attempt.findUnique({
    where: { id: attempt.id },
    include: {
      answers: true,
    },
  });

  if (!activeAttempt || activeAttempt.status !== "IN_PROGRESS") {
    redirect(`/challenges/${challenge.slug}/result`);
  }

  // 5. Reconstruct randomized questions based on persisted order
  const questionOrder = (activeAttempt.questionOrder as string[]) || [];
  const optionOrders = (activeAttempt.optionOrders as Record<string, string[]>) || {};

  const clientQuestions = questionOrder
    .map((qId) => {
      const cq = challenge.questions.find((q) => q.questionId === qId);
      if (!cq) return null;

      const orderedOptions = (optionOrders[qId] || [])
        .map((optId) => {
          return cq.question.options.find((o) => o.id === optId);
        })
        .filter(Boolean);

      return {
        id: cq.question.id,
        question: cq.question.question,
        options: orderedOptions as { id: string; optionText: string }[],
      };
    })
    .filter(Boolean) as {
    id: string;
    question: string;
    options: { id: string; optionText: string }[];
  }[];

  // 6. Build initial answers map
  const initialAnswers: Record<string, string> = {};
  activeAttempt.answers.forEach((ans) => {
    if (ans.selectedOptionId) {
      initialAnswers[ans.questionId] = ans.selectedOptionId;
    }
  });

  return (
    <QuizEngineClient
      attemptId={activeAttempt.id}
      challengeSlug={challenge.slug}
      expiresAt={
        activeAttempt.expiresAt ? activeAttempt.expiresAt.toISOString() : new Date().toISOString()
      }
      questions={clientQuestions}
      initialAnswers={initialAnswers}
      isFlagged={activeAttempt.isFlagged}
    />
  );
}
