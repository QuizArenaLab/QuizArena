export interface ReportDefinition {
  id: string;
  name: string;
  category: string;
  version: string;
  owner: string;
  readModels: string[];
  exportFormats: string[];
  permissions: string[];
  scheduleSupport: boolean;
}

export class ReportRegistry {
  private reports: Map<string, ReportDefinition> = new Map();

  public register(report: ReportDefinition): void {
    this.reports.set(report.id, report);
  }

  public get(id: string): ReportDefinition | undefined {
    return this.reports.get(id);
  }

  public listAll(): ReportDefinition[] {
    return Array.from(this.reports.values());
  }
}
