export interface ExportManifest {
  exportId: string;
  reportVersion: string;
  generatedAt: string;
  filters: Record<string, any>;
  template: string;
  schema: string;
  checksum: string;
  generatedBy: string;
}
