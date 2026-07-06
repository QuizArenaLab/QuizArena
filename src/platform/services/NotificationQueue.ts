import { NotificationPayload, notificationService } from "./NotificationService";

export class NotificationQueue {
  private queue: NotificationPayload[] = [];
  private isProcessing: boolean = false;

  enqueue(payload: NotificationPayload) {
    this.queue.push(payload);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const payload = this.queue.shift();
      if (payload) {
        try {
          await notificationService.send(payload);
        } catch (error) {
          console.error("[NotificationQueue] Failed to process notification, re-queueing", error);
          // Simple retry mechanism (in a real app, we'd use dead letter queues)
          this.queue.push(payload);
        }
      }
    }

    this.isProcessing = false;
  }
}

export const notificationQueue = new NotificationQueue();
