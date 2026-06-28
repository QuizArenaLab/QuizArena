import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";
import type { WorkspaceInitPayload } from "@/types/competition-experience";

export class SessionManager implements IRuntimeManager {
  private controller!: RuntimeController;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {
    if (cmd.commandType === "InitializeSession") {
      this.handleInitializeSession(cmd.payload);
    }
  }

  async handleEvent(evt: RuntimeEvent) {
    // No-op
  }

  private handleInitializeSession(payload: WorkspaceInitPayload) {
    this.controller.updateState({
      sessionId: payload.sessionId,
      competitionId: payload.competitionId,
      competitionSlug: payload.competitionSlug,
      competitionTitle: payload.competitionTitle,

      serverExpiresAt: payload.serverExpiresAt,

      questions: payload.questions,
      answers: payload.initialAnswers,
      visitedMap: payload.visitedMap,
      reviewMap: payload.reviewMap,

      status: "READY",
    });

    this.controller.events.emit("SessionStarted", payload, payload.sessionId);
  }

  getDiagnostics() {
    return { name: "SessionManager", status: "healthy" };
  }

  restore(snapshot: any) {
    // No-op for SessionManager, handled broadly by RuntimeHost state restoration
  }

  destroy() {
    // Clean up
  }
}
