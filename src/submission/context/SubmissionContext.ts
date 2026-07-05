import { SubmissionPackage } from '../../runtime/submission/SubmissionPackage';

export interface SubmissionContext {
  package: SubmissionPackage;
  // State mutations during the kernel pipeline
  validationResults?: any;
  fraudAssessment?: any;
  objectiveEvaluation?: any;
  scores?: any;
  evaluationSnapshot?: any;
  submissionResult?: any;
}
