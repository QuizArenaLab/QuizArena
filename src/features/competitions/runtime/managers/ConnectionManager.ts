import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class ConnectionManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private handleOnline = () => this.setOnline();
  private handleOffline = () => this.setOffline();

  initialize(controller: RuntimeController) {
    this.controller = controller;

    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);

      if (!navigator.onLine) {
        this.setOffline();
      }
    }
  }

  async handleCommand(cmd: RuntimeCommand) {}
  async handleEvent(evt: RuntimeEvent) {}

  private setOnline() {
    this.controller.updateState({ connectionStatus: "Connected" });
    const state = this.controller.getState();
    this.controller.events.emit("ConnectionRecovered", {}, state.sessionId);
  }

  private setOffline() {
    this.controller.updateState({ connectionStatus: "Offline" });
    const state = this.controller.getState();
    this.controller.events.emit("ConnectionLost", {}, state.sessionId);
  }

  getDiagnostics() {
    return { name: "ConnectionManager", status: this.controller?.getState().connectionStatus };
  }

  restore(snapshot: any) {}

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
  }
}
