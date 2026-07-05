import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export class EvaluationPipeline {
  /**
   * Executes the full evaluation pipeline for a given SubmissionRecord.
   * Produces an immutable SubmissionResult.
   */
  public static async evaluate(submissionRecordId: string) {
    const submission = await prisma.submissionRecord.findUnique({
      where: { id: submissionRecordId },
      include: {
        attempt: {
          include: {
            competition: {
              include: {
                questions: {
                  include: {
                    question: {
                      include: { options: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new Error(`SubmissionRecord not found: ${submissionRecordId}`);
    }

    // Check if result already exists to prevent duplicate evaluation
    const existingResult = await prisma.submissionResult.findUnique({
      where: { submissionRecordId }
    });

    if (existingResult) {
      throw new Error(`SubmissionRecord is already evaluated: ${submissionRecordId}`);
    }

    const evaluationSnapshot = submission.evaluationSnapshot as any;
    if (!evaluationSnapshot || !evaluationSnapshot.answers) {
      throw new Error("Invalid or missing evaluationSnapshot on SubmissionRecord.");
    }

    const answers = evaluationSnapshot.answers as any[];
    const competitionQuestions = submission.attempt.competition.questions;

    // 1. AnswerEvaluator
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let score = 0; // Absolute marks
    
    const evaluatedAnswers = answers.map((ans) => {
      const compQ = competitionQuestions.find((cq) => cq.questionId === ans.questionId);
      const q = compQ?.question;
      
      let isCorrect = false;
      let isSkipped = false;
      let marksAwarded = 0;

      if (!ans.selectedOptionId) {
        isSkipped = true;
        unansweredCount++;
      } else if (q) {
        const correctOption = q.options.find((o) => o.isCorrect);
        if (correctOption && correctOption.id === ans.selectedOptionId) {
          isCorrect = true;
          correctCount++;
          marksAwarded = 1; // Assuming 1 mark per question for MVP
          score += marksAwarded;
        } else {
          wrongCount++;
        }
      } else {
        // Fallback for corrupt data
        isSkipped = true;
        unansweredCount++;
      }

      return {
        ...ans,
        isCorrect,
        isSkipped,
        marksAwarded,
      };
    });

    const totalQuestions = competitionQuestions.length;
    const answeredCount = correctCount + wrongCount;
    const accuracy = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // 2. Snapshot Generators
    const newEvaluationSnapshot = {
      ...evaluationSnapshot,
      evaluatedAnswers,
    };

    const insightSnapshot = {
      strengths: [], // Placeholder for InsightGenerator
      weaknesses: [],
    };

    const presentationSnapshot = {
      summary: "Completed",
    };

    const rankingSnapshot = {
      score,
      timeTakenInSeconds: submission.attempt.timeTakenInSeconds,
      submittedAt: submission.submittedAt,
    };

    // 3. SubmissionResultBuilder
    const result = await prisma.submissionResult.create({
      data: {
        submissionRecordId,
        score,
        accuracy,
        percentage,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        unansweredCount,
        evaluationSnapshot: newEvaluationSnapshot,
        insightSnapshot,
        presentationSnapshot,
        rankingSnapshot,
      },
    });

    // 4. RankingCandidateBuilder (Publish to EventBus / Queue in real life)
    const compId = submission.attempt.competitionId;
    
    // We import eventBus dynamically to avoid circular dependencies if any
    const { eventBus } = await import("@/platform/events/InMemoryEventBus");
    const { v4: uuidv4 } = await import("uuid");

    await eventBus.publish({
      eventId: uuidv4(),
      type: "SubmissionEvaluated",
      timestamp: new Date().toISOString(),
      correlationId: submissionRecordId,
      version: "1.0",
      sourceDomain: "Evaluation",
      payload: { resultId: result.id, attemptId: submission.attemptId }
    });

    await eventBus.publish({
      eventId: uuidv4(),
      type: "RankingCandidateGenerated",
      timestamp: new Date().toISOString(),
      correlationId: submissionRecordId,
      version: "1.0",
      sourceDomain: "Evaluation",
      payload: { resultId: result.id, competitionId: compId }
    });
    
    const eligibilityPayload = { 
      resultId: result.id, 
      competitionId: compId,
      score: result.score,
      percentage: result.percentage
    };
    
    await eventBus.publish({
      eventId: uuidv4(),
      type: "CertificateEligibilityGenerated",
      timestamp: new Date().toISOString(),
      correlationId: submissionRecordId,
      version: "1.0",
      sourceDomain: "Evaluation",
      payload: eligibilityPayload
    });

    return result;
  }
}
