import { PlatformEventBus } from "./PlatformEventBus";
import { RankingWorker } from "../../features/competitions/submission/workers/RankingWorker";

let isInitialized = false;

export function initializeEventBus() {
  if (isInitialized) return;
  isInitialized = true;

  console.log("[EventRegistry] Initializing Event Bus and Subscriptions");

  // 1. Subscribe to Domain Events
  PlatformEventBus.subscribe("competition.attempt.submitted", async (event: any) => {
    try {
      console.log(
        `[EventBus] Handling competition.attempt.submitted for sessionId: ${event.payload.sessionId}`
      );
      const worker = new RankingWorker();
      await worker.processAttempt({
        sessionId: event.payload.sessionId,
        competitionId: event.payload.competitionId,
        userId: event.payload.userId,
        scoreData: event.payload.scoreData,
        attemptResult: event.payload.attemptResult,
      });

      // Trigger Notification
      const { notificationService } = await import("../../platform/services/NotificationService");
      // Ideally we fetch user email from DB, mocking it here for the payload
      await notificationService.send({
        to: "user@example.com", // TODO: Fetch real user email
        subject: "Your QuizArena Submission was Successful!",
        html: `<p>Thank you for submitting your attempt for Competition ${event.payload.competitionId}.</p>`,
      });
    } catch (err) {
      console.error(`[EventBus] Failed to process competition.attempt.submitted:`, err);
    }
  });

  // Add more event subscriptions here as we build them out
}
