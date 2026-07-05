import { SubmissionPackage } from '../../runtime/submission/SubmissionPackage';

export interface SubmissionCommand {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface ProcessSubmission extends SubmissionCommand {
  type: 'ProcessSubmission';
  payload: SubmissionPackage;
}
