import { prisma } from "@/lib/prisma";
import { 
  CompetitionResultReadModel, 
  QuestionReviewItem,
  SectionMetric
} from "../types/results.types";
import { RecommendationService } from "../services/recommendations/RecommendationService";
import { PerformanceInsightGenerator } from "../services/insights/PerformanceInsightGenerator";

export class CompetitionResultsFacade {
  /**
   * Retrieves an immutable read model for a given attempt.
   * Ensures the user is authorized and the attempt is fully completed.
   */
  public static async getResultReadModel(
    attemptId: string,
    userId: string
  ): Promise<CompetitionResultReadModel> {
    const attempt = await prisma.competitionAttempt.findUnique({
      where: { sessionId: attemptId },
      include: {
        competition: {
          include: {
            config: true,
            questions: {
              include: {
                question: {
                  include: { options: true }
                }
              }
            }
          }
        },
        session: true
      }
    });

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (attempt.userId !== userId) {
      throw new Error("Unauthorized access to result");
    }

    if (attempt.session.status !== "SUBMITTED") {
      throw new Error("Result is not yet available for this attempt");
    }

    // Safely parse JSON snapshots
    const resultSnapshot: any = attempt.resultSnapshot || {};
    const evalSnapshot: any = attempt.evaluationSnapshot || {};
    const evalAnswers = evalSnapshot.evaluatedAnswers || [];

    // Assemble Review Items
    const questionReviews: QuestionReviewItem[] = evalAnswers.map((ea: any) => {
      const compQ = attempt.competition.questions.find((cq: any) => cq.questionId === ea.questionId);
      const qData = compQ?.question;
      
      const options = qData?.options?.map((o: any) => ({
        id: o.id,
        text: o.optionText,
        isCorrect: o.isCorrect
      })) || [];

      const correctOption = options.find((o: any) => o.isCorrect);

      return {
        questionId: ea.questionId,
        questionText: qData?.question || "Question Data Unavailable",
        options,
        userAnswerId: ea.selectedOptionId,
        correctAnswerId: correctOption?.id || null,
        explanation: qData?.explanation || null,
        marksAwarded: ea.marksAwarded,
        isCorrect: ea.isCorrect,
        isSkipped: ea.isSkipped
      };
    });

    // Sections (Mocking empty if not applicable in this schema version)
    const sections: SectionMetric[] = [];

    // Generators
    const insights = PerformanceInsightGenerator.generate(
      questionReviews, 
      attempt.accuracy, 
      attempt.timeTakenInSeconds,
      attempt.competition.questions.length
    );

    const recommendations = RecommendationService.generateRecommendations(
      attempt.accuracy,
      attempt.percentage,
      "SUBMITTED",
      attempt.competition.slug
    );

    const nextActions = RecommendationService.generateNextActions(
      attempt.competition.slug,
      "SUBMITTED"
    );

    return {
      attemptId: attempt.sessionId,
      competitionTitle: attempt.competition.title,
      competitionSlug: attempt.competition.slug,
      status: attempt.percentage >= (attempt.competition.config as any)?.passPercentage ? "PASSED" : "FAILED",
      score: attempt.score,
      maxScore: attempt.competition.questions.length, // Rough estimation for MVP, ideally stored in snapshot
      accuracy: attempt.accuracy,
      timeTakenInSeconds: attempt.timeTakenInSeconds,
      attemptDate: attempt.submittedAt.toISOString(),
      metadata: {
        competitionVersion: resultSnapshot.competitionVersion || "1",
        questionVersion: "1",
        scoringVersion: "1",
        evaluationVersion: "1",
        generatedAt: attempt.submittedAt.toISOString()
      },
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.wrongAnswers,
      skippedQuestions: attempt.unansweredCount,
      marksAwarded: attempt.score,
      negativeMarks: 0, // Fallback if not tracked perfectly in snapshot
      percentage: attempt.percentage,
      completionRate: ((attempt.correctAnswers + attempt.wrongAnswers) / attempt.competition.questions.length) * 100,
      averageTimePerQuestion: attempt.timeTakenInSeconds / attempt.competition.questions.length,
      questionReviews,
      sections,
      insights,
      recommendations,
      nextActions
    };
  }
}
