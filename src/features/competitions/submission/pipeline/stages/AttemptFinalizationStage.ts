import { PipelineContext } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";

export class AttemptFinalizationStage implements IPipelineStage {
  async validate(context: PipelineContext): Promise<boolean> {
    if (!context.resultSnapshot || !context.fraudAssessment) {
      throw new Error("AttemptFinalizationStage requires Result and Fraud snapshots");
    }
    return true;
  }

  async execute(context: PipelineContext, tx: any): Promise<void> {
    const result = context.resultSnapshot!;
    const fraud = context.fraudAssessment!;
    const score = (context as any).scoreCalculation;

    // Create the immutable CompetitionAttempt
    await tx.competitionAttempt.upsert({
      where: { sessionId: context.sessionId },
      create: {
        sessionId: context.sessionId,
        competitionId: context.competitionId,
        userId: context.userId,
        score: score.marks,
        accuracy: score.accuracy,
        percentage: score.percentage,
        correctAnswers: score.correct,
        wrongAnswers: score.incorrect,
        unansweredCount: score.skipped,
        timeTakenInSeconds: result.timeTakenInSeconds,
        evaluationSnapshot: context.evaluationSnapshot as any,
        resultSnapshot: result as any,
        fraudAssessment: fraud as any,
        pipelineMetrics: context.metrics as any,
      },
      update: {
        // Technically an attempt shouldn't be re-evaluatable in a production system.
        // But for dev/idempotency we can update if it somehow got here again.
        score: score.marks,
        accuracy: score.accuracy,
        percentage: score.percentage,
        correctAnswers: score.correct,
        wrongAnswers: score.incorrect,
        unansweredCount: score.skipped,
        timeTakenInSeconds: result.timeTakenInSeconds,
        evaluationSnapshot: context.evaluationSnapshot as any,
        resultSnapshot: result as any,
        fraudAssessment: fraud as any,
        pipelineMetrics: context.metrics as any,
      }
    });

    // Mark the session as SUBMITTED
    // The previous state was SUBMITTING (set in ValidationStage)
    await tx.competitionSession.update({
      where: { id: context.sessionId },
      data: { status: "SUBMITTED" }
    });
  }

  getDiagnostics() {
    return { name: "AttemptFinalizationStage" };
  }
}
