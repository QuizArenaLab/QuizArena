export class ReportExecutionPipeline {
  public execute(reportId: string): void {
    this.prepare(reportId);
    this.validate(reportId);
    this.snapshot(reportId);
    this.generate(reportId);
    this.sign(reportId);
    this.store(reportId);
    this.distribute(reportId);
    this.audit(reportId);
  }

  private prepare(reportId: string): void {}
  private validate(reportId: string): void {}
  private snapshot(reportId: string): void {}
  private generate(reportId: string): void {}
  private sign(reportId: string): void {}
  private store(reportId: string): void {}
  private distribute(reportId: string): void {}
  private audit(reportId: string): void {}
}
