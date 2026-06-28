import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";
import { syncAnswers } from "../services/server-actions";

export class AutoSaveManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private pendingSync = new Set<string>();
  private syncTimeout: NodeJS.Timeout | null = null;
  private isSyncing = false;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {}

  async handleEvent(evt: RuntimeEvent) {
    if (
      evt.eventType === "AnswerChanged" ||
      evt.eventType === "ReviewMarkChanged" ||
      evt.eventType === "QuestionNavigated"
    ) {
      const qId = evt.payload.questionId;
      if (qId) {
        this.pendingSync.add(qId);
        this.controller.updateState({ mutationQueueSize: this.pendingSync.size });
        this.scheduleSync();
      }
    }
  }

  private scheduleSync() {
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => this.performSync(), 2000);
  }

  private async performSync() {
    if (this.pendingSync.size === 0 || this.isSyncing) return;
    this.isSyncing = true;

    const state = this.controller.getState();
    if (
      state.connectionStatus === "Offline" ||
      (state.status !== "RUNNING" && state.status !== "READY")
    ) {
      this.isSyncing = false;
      return;
    }

    const questionIdsToSync = Array.from(this.pendingSync);
    this.pendingSync.clear();

    const payload = questionIdsToSync.map((qId) => ({
      questionId: qId,
      selectedOptionId: state.answers[qId] || null,
      isVisited: !!state.visitedMap[qId],
      isMarkedForReview: !!state.reviewMap[qId],
      answeredAt: new Date(),
    }));

    this.controller.updateState({ connectionStatus: "Saving" });
    this.controller.events.emit("SyncStarted", { count: payload.length }, state.sessionId);

    try {
      const res = await syncAnswers(state.sessionId, { answers: payload });
      if (res.success) {
        this.controller.updateState({
          connectionStatus: "Connected",
          lastSyncAt: new Date().getTime(),
          mutationQueueSize: this.pendingSync.size, // in case more piled up
        });
        this.controller.events.emit("SyncCompleted", { count: payload.length }, state.sessionId);
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      console.error("[AutoSaveManager] Sync failed", err);
      // requeue
      questionIdsToSync.forEach((id) => this.pendingSync.add(id));
      this.controller.updateState({
        connectionStatus: "Connected", // or error state
        mutationQueueSize: this.pendingSync.size,
      });
      this.controller.events.emit("SyncFailed", { error: err }, state.sessionId);
    } finally {
      this.isSyncing = false;
      if (this.pendingSync.size > 0) {
        this.scheduleSync();
      }
    }
  }

  getDiagnostics() {
    return { name: "AutoSaveManager", queueSize: this.pendingSync.size, isSyncing: this.isSyncing };
  }

  restore(snapshot: any) {}

  destroy() {
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
  }
}
