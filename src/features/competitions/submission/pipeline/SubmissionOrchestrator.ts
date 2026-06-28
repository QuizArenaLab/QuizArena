import { prisma } from "@/lib/prisma";
import { PipelineContext } from "../types/pipeline.types";
import { IPipelineStage } from "./PipelineStage";
import { DomainEventPublisher } from "../events/DomainEventPublisher";

export class SubmissionOrchestrator {
  private stages: IPipelineStage[] = [];

  constructor(private eventPublisher: DomainEventPublisher) {}

  public addStage(stage: IPipelineStage): this {
    this.stages.push(stage);
    return this;
  }

  public async execute(initialContext: PipelineContext): Promise<PipelineContext> {
    const context = { ...initialContext };
    const startTime = performance.now();

    try {
      // Execute the entire pipeline within a transaction
      await prisma.$transaction(async (tx) => {
        for (const stage of this.stages) {
          const stageName = stage.constructor.name;
          const stageStart = performance.now();

          // Validate Stage
          const isValid = await stage.validate(context, tx);
          if (!isValid) {
            throw new Error(`Validation failed at stage: ${stageName}`);
          }

          // Execute Stage
          await stage.execute(context, tx);

          const stageEnd = performance.now();
          this.recordStageMetrics(context, stageName, stageEnd - stageStart);
        }
      });

      // After successful commit, publish domain events
      context.metrics.totalPipelineDurationMs = performance.now() - startTime;
      await this.eventPublisher.publishAfterCommit(context);

      return context;
    } catch (error) {
      // Rollback is automatically handled by Prisma transaction
      // Execute custom rollbacks if any stage registered external side-effects
      for (const stage of [...this.stages].reverse()) {
        if (stage.rollback) {
          try {
            await stage.rollback(context);
          } catch (rollbackError) {
            console.error(`Rollback failed for stage ${stage.constructor.name}:`, rollbackError);
          }
        }
      }
      throw error;
    }
  }

  private recordStageMetrics(context: PipelineContext, stageName: string, durationMs: number) {
    if (stageName.includes("Validation")) context.metrics.validationTimeMs = durationMs;
    else if (stageName.includes("Fraud")) context.metrics.fraudAnalysisTimeMs = durationMs;
    else if (stageName.includes("Evaluation")) context.metrics.evaluationTimeMs = durationMs;
    else if (stageName.includes("Score")) context.metrics.scoringTimeMs = durationMs;
    else if (stageName.includes("Attempt")) context.metrics.attemptFinalizationTimeMs = durationMs;
  }
}
