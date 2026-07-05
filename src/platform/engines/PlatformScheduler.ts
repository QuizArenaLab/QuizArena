export interface ScheduledJob {
  jobId: string;
  type: string;
  executeAt: Date;
  payload: any;
}

export class PlatformScheduler {
  private jobs: ScheduledJob[] = [];
  private timer: any;

  public schedule(job: ScheduledJob): void {
    this.jobs.push(job);
    this.jobs.sort((a, b) => a.executeAt.getTime() - b.executeAt.getTime());
    this.ensureTimer();
  }

  private ensureTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    
    if (this.jobs.length === 0) return;
    
    const nextJob = this.jobs[0];
    const delay = nextJob.executeAt.getTime() - Date.now();
    
    if (delay <= 0) {
      this.executeNext();
    } else {
      this.timer = setTimeout(() => this.executeNext(), delay);
    }
  }

  private async executeNext(): Promise<void> {
    const job = this.jobs.shift();
    if (!job) return;
    
    console.log(`Executing scheduled job ${job.jobId} of type ${job.type}`);
    // In reality, this would dispatch a PlatformCommand or PlatformEvent
    
    this.ensureTimer();
  }
}
