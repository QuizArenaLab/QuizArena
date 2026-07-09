export class ReportingKernel {
  constructor(
    private readonly reportExecutionPipeline: any,
    private readonly reportScheduler: any,
    private readonly exportEngine: any,
    private readonly reportTemplateEngine: any,
    private readonly complianceCertificationEngine: any
  ) {}

  public executePipeline(reportId: string): void {
    this.reportExecutionPipeline.execute(reportId);
  }

  public scheduleReport(reportId: string, cron: string, destinations: string[]): void {
    this.reportScheduler.schedule(reportId, cron, destinations);
  }
}
