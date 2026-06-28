import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class TimerManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private intervalId: NodeJS.Timeout | null = null;
  private warned5Min = false;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {}

  async handleEvent(evt: RuntimeEvent) {
    if (evt.eventType === "SessionStarted" || evt.eventType === "SessionRecovered") {
      this.startTimer();
    }
  }

  private startTimer() {
    if (this.intervalId) clearInterval(this.intervalId);

    const tick = () => {
      const state = this.controller.getState();
      if (
        !state.serverExpiresAt ||
        state.status === "SUBMITTED" ||
        state.status === "SUBMITTING" ||
        state.status === "EXPIRED" ||
        state.status === "DESTROYED"
      ) {
        if (this.intervalId) clearInterval(this.intervalId);
        return;
      }

      // We only care about remaining time until serverExpiresAt.
      const remaining = Math.max(
        0,
        Math.floor((new Date(state.serverExpiresAt).getTime() - Date.now()) / 1000)
      );

      this.controller.updateState({ remainingSeconds: remaining });

      if (remaining === 0) {
        if (this.intervalId) clearInterval(this.intervalId);
        this.controller.updateState({ status: "EXPIRED" });
        this.controller.events.emit("TimerExpired", {}, state.sessionId);
        this.controller.commands.dispatch("SubmitCompetition", { autoSubmit: true });
      } else if (remaining === 300 && !this.warned5Min) {
        this.warned5Min = true;
        this.controller.events.emit("TimerWarning", { remaining }, state.sessionId);
      }
    };

    tick();
    this.intervalId = setInterval(tick, 1000);
  }

  getDiagnostics() {
    return { name: "TimerManager", running: this.intervalId !== null, warned5Min: this.warned5Min };
  }

  restore(snapshot: any) {}

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
