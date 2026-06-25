import { evaluateQuestions } from "./evaluator";
import { processDetectedIssues } from "./generator";

/**
 * Executes the full background operational evaluation pipeline.
 * Scheduler -> Evaluator -> Generator -> Logger -> Notifier
 */
export async function runOperationsEvaluation() {
  const startTime = Date.now();
  
  // 1. Evaluate questions against rules
  const detectedIssues = await evaluateQuestions();

  // 2. Generate and update issues (which also triggers logger and notifier internally)
  const result = await processDetectedIssues(detectedIssues);

  const durationMs = Date.now() - startTime;

  return {
    ...result,
    durationMs,
  };
}
