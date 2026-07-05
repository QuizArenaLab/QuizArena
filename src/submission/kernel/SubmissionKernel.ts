import { SubmissionContext } from '../context/SubmissionContext';
import { SubmissionFacade } from '../facade/SubmissionFacade';
import { RankingPayloadBuilder } from '../services/RankingPayloadBuilder';
import { ResultSnapshotGenerator } from '../services/ResultSnapshotGenerator';

export class SubmissionKernel {
  constructor(
    private facade: SubmissionFacade,
    private ranking: RankingPayloadBuilder,
    private snapshotGen: ResultSnapshotGenerator
  ) {}

  /**
   * Orchestrates the deterministic evaluation sequence.
   */
  public async evaluate(context: SubmissionContext): Promise<void> {
    console.log(`[SubmissionKernel] Starting evaluation for attempt ${context.package.attemptId}`);
    
    // 1. Validator (Schema and integrity)
    
    // 2. Fraud Assessment
    const fraud = await this.facade.getFraudAssessment().assess(context);
    context.fraudAssessment = fraud;

    // 3. Evaluation Engine
    const objective = await this.facade.getObjectiveEvaluator().evaluate(context);
    context.objectiveEvaluation = objective;

    const scores = await this.facade.getScoreCalculator().calculate(context);
    context.scores = scores;

    // 4. Ranking
    const rankingPayload = await this.ranking.build(context);

    // 5. Results
    const snapshot = await this.snapshotGen.generate(context);
    
    console.log('[SubmissionKernel] Evaluation complete');
  }
}
