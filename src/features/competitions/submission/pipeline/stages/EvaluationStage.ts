import { PipelineContext, EvaluatedAnswer } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";
import { EvaluationRegistry } from "../../evaluation/registry/EvaluationRegistry";

export class EvaluationStage implements IPipelineStage {
  async validate(context: PipelineContext): Promise<boolean> {
    if (!context.competition || !context.answers || !context.config) {
      throw new Error("EvaluationStage requires populated context");
    }
    return true;
  }

  async execute(context: PipelineContext): Promise<void> {
    const { competition, answers, config } = context;
    const evaluatedAnswers: EvaluatedAnswer[] = [];

    for (const answer of answers!) {
      // Find the corresponding question in the competition
      const compQuestion = competition.questions.find((cq: any) => cq.questionId === answer.questionId);
      
      if (!compQuestion || !compQuestion.question) {
        // Orphaned answer or question removed
        continue;
      }

      const questionData = compQuestion.question;
      const questionType = questionData.questionCategory || "SINGLE_CHOICE"; // Default for legacy/simplicity

      const evaluator = EvaluationRegistry.get(questionType);

      const isSkipped = !answer.selectedOptionId;

      if (isSkipped) {
        evaluatedAnswers.push({
          questionId: answer.questionId,
          selectedOptionId: null,
          isCorrect: false,
          isSkipped: true,
          marksAwarded: 0,
          negativeMarks: 0,
        });
      } else {
        const result = evaluator.evaluate(questionData, answer, config);
        evaluatedAnswers.push({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: result.isCorrect,
          isSkipped: false,
          marksAwarded: result.marksAwarded,
          negativeMarks: result.negativeMarks,
        });
      }
    }

    context.evaluationSnapshot = {
      evaluatedAnswers,
      competitionVersionId: competition.versionId || "LATEST"
    };
  }

  getDiagnostics() {
    return { name: "EvaluationStage" };
  }
}
