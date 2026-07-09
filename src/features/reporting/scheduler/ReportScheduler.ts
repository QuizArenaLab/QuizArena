export class ReportScheduler {
  public schedule(reportId: string, frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom', destinations: string[]): void {
    // Schedule report logic
  }

  public cancel(scheduleId: string): void {
    // Cancel logic
  }
}
