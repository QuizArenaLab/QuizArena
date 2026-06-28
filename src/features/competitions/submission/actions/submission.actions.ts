"use server";

import { requireUser } from "@/features/rbac/constants/authorization";
import { SubmissionOrchestrator } from "../pipeline/SubmissionOrchestrator";
import { DomainEventPublisher } from "../events/DomainEventPublisher";
import { ValidationStage } from "../pipeline/stages/ValidationStage";
import { FraudAnalysisStage } from "../pipeline/stages/FraudAnalysisStage";
import { EvaluationStage } from "../pipeline/stages/EvaluationStage";
import { ScoreCalculationStage } from "../pipeline/stages/ScoreCalculationStage";
import { ResultGenerationStage } from "../pipeline/stages/ResultGenerationStage";
import { AttemptFinalizationStage } from "../pipeline/stages/AttemptFinalizationStage";
import { PipelineContext } from "../types/pipeline.types";

export async function submitCompetitionSession(sessionId: string, competitionId: string) {
  const user = await requireUser();
  if (!user || !user.id) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Initialize Context
  const initialContext: PipelineContext = {
    userId: user.id,
    competitionId,
    sessionId,
    metrics: {}
  };

  // 2. Build Pipeline
  const publisher = new DomainEventPublisher();
  const orchestrator = new SubmissionOrchestrator(publisher)
    .addStage(new ValidationStage())
    .addStage(new FraudAnalysisStage())
    .addStage(new EvaluationStage())
    .addStage(new ScoreCalculationStage())
    .addStage(new ResultGenerationStage())
    .addStage(new AttemptFinalizationStage());

  // 3. Execute Pipeline
  try {
    const resultContext = await orchestrator.execute(initialContext);
    
    // Client only needs to know it was successfully evaluated. 
    // Further results can be fetched from a specific results endpoint.
    return { 
      success: true, 
      result: {
        score: resultContext.resultSnapshot?.marks,
        percentage: resultContext.resultSnapshot?.percentage,
        accuracy: resultContext.resultSnapshot?.accuracy,
        timeTakenInSeconds: resultContext.resultSnapshot?.timeTakenInSeconds
      }
    };
  } catch (error: any) {
    console.error("[SubmissionAction] Pipeline failed:", error);
    return { 
      success: false, 
      error: error.message || "Failed to process submission. Please try again." 
    };
  }
}
