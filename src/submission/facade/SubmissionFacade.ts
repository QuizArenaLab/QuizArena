import { FraudDetectionEngine } from '../services/FraudDetectionEngine';
import { ObjectiveEvaluator } from '../services/ObjectiveEvaluator';
import { ScoreCalculator } from '../services/ScoreCalculator';
import { SectionScoreCalculator } from '../services/SectionScoreCalculator';
import { AggregateCalculator } from '../services/AggregateCalculator';

export class SubmissionFacade {
  constructor(
    private fraud: FraudDetectionEngine,
    private objective: ObjectiveEvaluator,
    private score: ScoreCalculator,
    private section: SectionScoreCalculator,
    private aggregate: AggregateCalculator
  ) {}

  public getFraudAssessment() { return this.fraud; }
  public getObjectiveEvaluator() { return this.objective; }
  public getScoreCalculator() { return this.score; }
  public getSectionCalculator() { return this.section; }
  public getAggregateCalculator() { return this.aggregate; }
}
