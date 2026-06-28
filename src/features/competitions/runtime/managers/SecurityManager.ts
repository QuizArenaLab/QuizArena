import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class SecurityManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private violationsCount = 0;

  private handleVisibilityChange = () => {
    if (typeof document !== "undefined" && document.hidden) {
      this.logViolation("TAB_HIDDEN");
    }
  };

  private handleBlur = () => {
    this.logViolation("WINDOW_BLUR");
  };

  private handleFullscreenChange = () => {
    if (typeof document !== "undefined" && !document.fullscreenElement) {
      this.logViolation("FULLSCREEN_EXIT");
    }
  };

  initialize(controller: RuntimeController) {
    this.controller = controller;

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
      window.addEventListener("blur", this.handleBlur);
      document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    }
  }

  async handleCommand(cmd: RuntimeCommand) {}
  async handleEvent(evt: RuntimeEvent) {}

  private logViolation(type: string) {
    const state = this.controller.getState();
    if (state.status === "SUBMITTED" || state.status === "DESTROYED") return;

    this.violationsCount++;
    console.warn(`[SecurityManager] Violation detected: ${type}`);
    this.controller.events.emit("SecurityViolation", { type }, state.sessionId);
  }

  getDiagnostics() {
    return { name: "SecurityManager", violations: this.violationsCount };
  }

  restore(snapshot: any) {}

  destroy() {
    if (typeof window !== "undefined") {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      window.removeEventListener("blur", this.handleBlur);
      document.removeEventListener("fullscreenchange", this.handleFullscreenChange);
    }
  }
}
