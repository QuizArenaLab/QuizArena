import { PipelineContext, FraudAssessment } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";

export class FraudAnalysisStage implements IPipelineStage {
  async validate(context: PipelineContext): Promise<boolean> {
    if (!context.session) throw new Error("ValidationStage must run before FraudAnalysisStage");
    return true;
  }

  async execute(context: PipelineContext): Promise<void> {
    const session = context.session;
    const flags: string[] = [];
    let fraudScore = 0; // 0-100

    // 1. Tab switches and window blurs
    if (session.tabSwitchCount > 0) {
      flags.push(`Tab switches: ${session.tabSwitchCount}`);
      fraudScore += Math.min(session.tabSwitchCount * 10, 50);
    }
    if (session.blurCount > 0) {
      flags.push(`Window blurs: ${session.blurCount}`);
      fraudScore += Math.min(session.blurCount * 5, 30);
    }

    // 2. Duration analysis
    const timeTakenMs = Date.now() - new Date(session.startedAt).getTime();
    const timeTakenSeconds = timeTakenMs / 1000;
    
    // Impossible completion time (e.g. 10 seconds for 50 questions)
    const questionCount = session.competition?.questions?.length || 0;
    const minPlausibleTime = questionCount * 2; // Assume at least 2 seconds per question reading
    
    if (timeTakenSeconds > 0 && timeTakenSeconds < minPlausibleTime) {
      flags.push(`Impossible completion time: ${Math.floor(timeTakenSeconds)}s for ${questionCount} questions`);
      fraudScore += 60;
    }

    // Classification
    let risk: FraudAssessment["risk"] = "LOW";
    if (fraudScore >= 80) risk = "CRITICAL";
    else if (fraudScore >= 50) risk = "HIGH";
    else if (fraudScore >= 20) risk = "MEDIUM";

    context.fraudAssessment = {
      risk,
      flags,
      score: Math.min(fraudScore, 100)
    };
  }

  getDiagnostics() {
    return { name: "FraudAnalysisStage" };
  }
}
