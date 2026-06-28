import { IQuestionEvaluator } from "./IQuestionEvaluator";

export class TrueFalseEvaluator implements IQuestionEvaluator {
  evaluate(question: any, answer: any, config: any) {
    if (!answer || answer.selectedOptionId === undefined) {
      return { isCorrect: false, marksAwarded: 0, negativeMarks: 0 };
    }

    const correctOption = question.options.find((o: any) => o.isCorrect);
    
    if (!correctOption) {
      return { isCorrect: false, marksAwarded: 0, negativeMarks: 0 };
    }

    const isCorrect = correctOption.id === answer.selectedOptionId;

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
