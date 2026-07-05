export interface RuntimeSnapshot {
  snapshotId: string;
  snapshotVersion: string;
  timestamp: Date;
  sessionId: string;
  answers: any;
  timer: any;
  flags: any;
  reviewMarks: string[]; // Question IDs marked for review
  navigation: any;
  workspace: any;
}
