export interface IQuestionEvaluator {
  evaluate(
    question: any,
    answer: any,
    config: any
  ): {
    isCorrect: boolean;
    marksAwarded: number;
    negativeMarks: number;
  };
}
