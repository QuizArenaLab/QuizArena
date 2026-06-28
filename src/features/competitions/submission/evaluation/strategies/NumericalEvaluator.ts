import { IQuestionEvaluator } from "./IQuestionEvaluator";

export class NumericalEvaluator implements IQuestionEvaluator {
  evaluate(question: any, answer: any, config: any) {
    if (!answer || answer.numericValue === undefined) {
      return { isCorrect: false, marksAwarded: 0, negativeMarks: 0 };
    }

    // Numerical questions store the correct value in `correctValue` or the first option
    const correctValueStr = question.correctValue || question.options[0]?.optionText;
    const correctValue = parseFloat(correctValueStr);
    const selectedValue = parseFloat(answer.numericValue);

    const isCorrect = !isNaN(correctValue) && correctValue === selectedValue;

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
