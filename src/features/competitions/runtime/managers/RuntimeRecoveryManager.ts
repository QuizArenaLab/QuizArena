import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class RuntimeRecoveryManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private intervalId: NodeJS.Timeout | null = null;
  private SNAPSHOT_INTERVAL_MS = 10000; // Snapshot every 10 seconds
  private lastSnapshotTime: Date | null = null;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {}

  async handleEvent(evt: RuntimeEvent) {
    if (evt.eventType === "SessionStarted" || evt.eventType === "SessionRecovered") {
      this.startSnapshots();
    }
  }

  private startSnapshots() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const state = this.controller.getState();
      if (state.status === "RUNNING" || state.status === "READY") {
        const snapshot = this.controller.createSnapshot();
        if (typeof window !== "undefined") {
          localStorage.setItem(`workspace-snapshot-${state.sessionId}`, JSON.stringify(snapshot));
          this.lastSnapshotTime = new Date();
        }
      }
    }, this.SNAPSHOT_INTERVAL_MS);
  }

  getDiagnostics() {
    return {
      name: "RuntimeRecoveryManager",
      running: this.intervalId !== null,
      lastSnapshotTime: this.lastSnapshotTime,
    };
  }

  restore(snapshot: any) {}

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
