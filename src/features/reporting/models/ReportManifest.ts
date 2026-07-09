export interface ReportManifest {
  reportId: string;
  version: string;
  generatedAt: string;
  templateVersion: string;
  filters: Record<string, any>;
  snapshotId: string;
  checksum: string;
  evidenceId: string;
  generatedBy: string;
}
