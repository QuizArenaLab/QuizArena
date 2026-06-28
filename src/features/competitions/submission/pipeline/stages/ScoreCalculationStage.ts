import { PipelineContext } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";

export class ScoreCalculationStage implements IPipelineStage {
  async validate(context: PipelineContext): Promise<boolean> {
    if (!context.evaluationSnapshot || !context.config) {
      throw new Error("ScoreCalculationStage requires an EvaluationSnapshot");
    }
    return true;
  }

  async execute(context: PipelineContext): Promise<void> {
    const { evaluatedAnswers } = context.evaluationSnapshot!;
    const config = context.config;

    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let marks = 0;
    let totalNegativeMarks = 0;

    for (const ans of evaluatedAnswers) {
      if (ans.isSkipped) {
        skipped++;
      } else if (ans.isCorrect) {
        correct++;
        marks += ans.marksAwarded;
      } else {
        incorrect++;
        totalNegativeMarks += ans.negativeMarks;
      }
    }

    const finalMarks = Math.max(0, marks - totalNegativeMarks); // Don't let total score go below 0 usually, but rules can dictate
    const totalAnswered = correct + incorrect;
    const accuracy = totalAnswered > 0 ? (correct / totalAnswered) * 100 : 0;
    const maxMarks = config.maximumMarks || (evaluatedAnswers.length * 1); // fallback
    const percentage = maxMarks > 0 ? (finalMarks / maxMarks) * 100 : 0;

    // Attach to context for the Result Generation Stage
    (context as any).scoreCalculation = {
      correct,
      incorrect,
      skipped,
      marks: finalMarks,
      accuracy,
      percentage
    };
  }

  getDiagnostics() {
    return { name: "ScoreCalculationStage" };
  }
}
