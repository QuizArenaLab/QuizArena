export interface SubmissionPackage {
  attemptId: string;
  competitionArtifactId: string;
  runtimeVersion: string;
  answers: any;
  reviewFlags: string[];
  duration: number;
  startedAt: Date;
  submittedAt: Date;
  deviceMetadata: any;
  connectionMetadata: any;
  integrityMetadata: any;
}
