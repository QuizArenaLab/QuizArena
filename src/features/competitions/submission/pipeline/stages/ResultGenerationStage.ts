import { PipelineContext } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";

export class ResultGenerationStage implements IPipelineStage {
  async validate(context: PipelineContext): Promise<boolean> {
    if (!(context as any).scoreCalculation || !context.fraudAssessment) {
      throw new Error("ResultGenerationStage requires score and fraud assessments");
    }
    return true;
  }

  async execute(context: PipelineContext): Promise<void> {
    const scoreData = (context as any).scoreCalculation;
    const fraudData = context.fraudAssessment!;
    const session = context.session;
    
    const timeTakenMs = Date.now() - new Date(session.startedAt).getTime();

    context.resultSnapshot = {
      correct: scoreData.correct,
      incorrect: scoreData.incorrect,
      skipped: scoreData.skipped,
      accuracy: scoreData.accuracy,
      marks: scoreData.marks,
      percentage: scoreData.percentage,
      timeTakenInSeconds: Math.floor(timeTakenMs / 1000),
      fraudRisk: fraudData.risk,
      competitionVersion: context.competition.versionId || "LATEST"
    };
  }

  getDiagnostics() {
    return { name: "ResultGenerationStage" };
  }
}
