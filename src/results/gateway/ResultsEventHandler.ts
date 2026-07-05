import { SubmissionResult } from '../../submission/models/SubmissionResult';

export interface PlatformEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

export class ResultsEventHandler {
  constructor(private gateway: any) {}

  /**
   * Listens to the platform event bus for SubmissionCompleted.
   */
  public async handleEvent(event: PlatformEvent): Promise<void> {
    if (event.type === 'SubmissionCompleted') {
      const result: SubmissionResult = event.payload;
      console.log(`[ResultsEventHandler] Received SubmissionCompleted for attempt ${result.attempt.attemptId}`);
      await this.gateway.ingestResult(result);
    }
  }
}
