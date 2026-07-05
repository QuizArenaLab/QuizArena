import { SubmissionResult } from '../../submission/models/SubmissionResult';

export interface ResultsContext {
  result: SubmissionResult;
  aggregate?: any; // The ResultAggregate being built
}
