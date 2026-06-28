import { IQuestionEvaluator } from "./IQuestionEvaluator";

export class MultipleChoiceEvaluator implements IQuestionEvaluator {
  evaluate(question: any, answer: any, config: any) {
    if (!answer || !answer.selectedOptionIds || !Array.isArray(answer.selectedOptionIds)) {
      return { isCorrect: false, marksAwarded: 0, negativeMarks: 0 };
    }

    const correctOptions = question.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
    const selectedOptions = answer.selectedOptionIds;

    const isCorrect = 
      correctOptions.length === selectedOptions.length &&
      correctOptions.every((id: string) => selectedOptions.includes(id));

    let marksAwarded = 0;
    let negativeMarks = 0;

    if (isCorrect) {
      marksAwarded = question.marks || 1;
    } else {
      if (config.negativeMarkingEnabled) {
        negativeMarks = question.negativeMarks || config.negativeMarkPerQuestion || 0;
      }
    }

    return { isCorrect, marksAwarded, negativeMarks };
  }
}
