import { IQuestionEvaluator } from "../strategies/IQuestionEvaluator";

import { SingleChoiceEvaluator } from "../strategies/SingleChoiceEvaluator";
import { MultipleChoiceEvaluator } from "../strategies/MultipleChoiceEvaluator";
import { TrueFalseEvaluator } from "../strategies/TrueFalseEvaluator";
import { NumericalEvaluator } from "../strategies/NumericalEvaluator";

export class EvaluationRegistry {
  private static evaluators = new Map<string, IQuestionEvaluator>([
    ["SINGLE_CHOICE", new SingleChoiceEvaluator()],
    ["MULTIPLE_CHOICE", new MultipleChoiceEvaluator()],
    ["TRUE_FALSE", new TrueFalseEvaluator()],
    ["NUMERIC", new NumericalEvaluator()],
  ]);

  public static register(type: string, evaluator: IQuestionEvaluator) {
    this.evaluators.set(type, evaluator);
  }

  public static get(type: string): IQuestionEvaluator {
    const evaluator = this.evaluators.get(type);
    if (!evaluator) {
      throw new Error(`No evaluator registered for question type: ${type}`);
    }
    return evaluator;
  }
}
