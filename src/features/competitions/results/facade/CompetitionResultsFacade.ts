import { prisma } from "@/lib/prisma";
import {
  CompetitionResultReadModel,
  QuestionReviewItem,
  SectionMetric,
} from "../types/results.types";
import { RecommendationService } from "../services/recommendations/RecommendationService";
import { PerformanceInsightGenerator } from "../services/insights/PerformanceInsightGenerator";

export class CompetitionResultsFacade {
  /**
   * Retrieves an immutable read model for a given attempt.
   * Ensures the user is authorized and the attempt is fully completed.
   */
  public static async getResultReadModel(
    submissionRecordId: string,
    userId: string
  ): Promise<CompetitionResultReadModel> {
    const submissionResult = await prisma.submissionResult.findUnique({
      where: { submissionRecordId },
      include: {
        submissionRecord: {
          include: {
            attempt: {
              include: {
                competition: {
                  include: { config: true },
                },
              },
            },
          },
        },
      },
    });

    if (!submissionResult) {
      throw new Error("Result is not yet available for this attempt");
    }

    if (submissionResult.submissionRecord.userId !== userId) {
      throw new Error("Unauthorized access to result");
    }

    // Safely parse JSON snapshots
    const evalSnapshot: any = submissionResult.evaluationSnapshot || {};
    const evalAnswers = evalSnapshot.evaluatedAnswers || [];

    const attempt = submissionResult.submissionRecord.attempt;

    // Assemble Review Items (Now read directly from evaluated answers)
    const questionReviews: QuestionReviewItem[] = evalAnswers.map((ea: any) => {
      // In a real system, the exact Question Data should be embedded in the Evaluation Snapshot
      // so we don't query the mutable DB again. For MVP, we trust the Evaluation Snapshot.
      return {
        questionId: ea.questionId,
        questionText: ea.questionText || "Question Data from Snapshot",
        options: ea.options || [],
        userAnswerId: ea.selectedOptionId,
        correctAnswerId: ea.correctAnswerId || null,
        explanation: ea.explanation || null,
        marksAwarded: ea.marksAwarded,
        isCorrect: ea.isCorrect,
        isSkipped: ea.isSkipped,
      };
    });

    // Sections
    const sections: SectionMetric[] = [];

    // Generators (Can also be replaced if stored in InsightSnapshot/RecommendationSnapshot)
    const insights = PerformanceInsightGenerator.generate(
      questionReviews,
      submissionResult.accuracy,
      attempt.timeTakenInSeconds,
      evalAnswers.length
    );

    const recommendations = RecommendationService.generateRecommendations(
      submissionResult.accuracy,
      submissionResult.percentage,
      "SUBMITTED",
      attempt.competition.slug
    );

    const nextActions = RecommendationService.generateNextActions(
      attempt.competition.slug,
      "SUBMITTED"
    );

    return {
      attemptId: attempt.sessionId, // Keep sessionId as attemptId for backwards compat in UI routing
      competitionTitle: attempt.competition.title,
      competitionSlug: attempt.competition.slug,
      status:
        submissionResult.percentage >= ((attempt.competition.config as any)?.passPercentage || 0)
          ? "PASSED"
          : "FAILED",
      score: submissionResult.score,
      maxScore: evalAnswers.length,
      accuracy: submissionResult.accuracy,
      timeTakenInSeconds: attempt.timeTakenInSeconds,
      attemptDate: submissionResult.submissionRecord.submittedAt.toISOString(),
      metadata: {
        competitionVersion: "1",
        questionVersion: "1",
        scoringVersion: "1",
        evaluationVersion: "1",
        generatedAt: submissionResult.evaluatedAt.toISOString(),
      },
      correctAnswers: submissionResult.correctAnswers,
      incorrectAnswers: submissionResult.wrongAnswers,
      skippedQuestions: submissionResult.unansweredCount,
      marksAwarded: submissionResult.score,
      negativeMarks: 0, 
      percentage: submissionResult.percentage,
      completionRate:
        ((submissionResult.correctAnswers + submissionResult.wrongAnswers) / evalAnswers.length) * 100,
      averageTimePerQuestion: attempt.timeTakenInSeconds / evalAnswers.length,
      questionReviews,
      sections,
      insights,
      recommendations,
      nextActions,
    };
  }
}
