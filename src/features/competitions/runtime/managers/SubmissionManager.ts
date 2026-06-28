import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";
import { submitSession } from "../services/server-actions";

export class SubmissionManager implements IRuntimeManager {
  private controller!: RuntimeController;
  private isSubmitting = false;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {
    if (cmd.commandType === "SubmitCompetition") {
      await this.handleSubmit(cmd.payload?.autoSubmit || false);
    }
  }

  async handleEvent(evt: RuntimeEvent) {}

  private async handleSubmit(autoSubmit: boolean) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const state = this.controller.getState();
    if (
      state.status === "SUBMITTED" ||
      state.status === "SUBMITTING" ||
      state.status === "DESTROYED"
    )
      return;

    this.controller.updateState({ status: "SUBMITTING" });
    this.controller.events.emit("SubmissionStarted", { autoSubmit }, state.sessionId);

    try {
      const res = await submitSession(state.sessionId);
      if (res.success && "data" in res) {
        this.controller.updateState({ status: "SUBMITTED" });
        this.controller.events.emit(
          "SubmissionCompleted",
          { attemptId: res.data?.attemptId },
          state.sessionId
        );

        if (typeof window !== "undefined") {
          window.location.href = `/dashboard/competitions/${state.competitionSlug}/processing`;
        }
      } else {
        throw new Error("error" in res ? res.error : "Submission failed");
      }
    } catch (err) {
      console.error("[SubmissionManager] Error:", err);
      this.controller.updateState({ status: "ERROR" });
      this.controller.events.emit("SubmissionFailed", { error: err }, state.sessionId);
      this.isSubmitting = false;
    }
  }

  getDiagnostics() {
    return { name: "SubmissionManager", isSubmitting: this.isSubmitting };
  }

  restore(snapshot: any) {}

  destroy() {}
}
