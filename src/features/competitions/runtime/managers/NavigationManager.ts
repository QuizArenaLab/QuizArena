import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class NavigationManager implements IRuntimeManager {
  private controller!: RuntimeController;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {
    if (cmd.commandType === "NavigateQuestion") {
      const { index } = cmd.payload;
      const state = this.controller.getState();

      if (index >= 0 && index < state.questions.length) {
        const questionId = state.questions[index].questionId;
        const newVisitedMap: Record<string, boolean> = { ...state.visitedMap, [questionId]: true };

        this.controller.updateState({
          currentIndex: index,
          visitedMap: newVisitedMap,
        });

        this.controller.events.emit("QuestionNavigated", { index, questionId }, state.sessionId);
      }
    }
  }

  async handleEvent(evt: RuntimeEvent) {
    // Navigate automatically initializes the first question's visited state on boot
    if (evt.eventType === "SessionStarted") {
      const state = this.controller.getState();
      if (state.questions.length > 0) {
        const firstQuestionId = state.questions[0].questionId;
        this.controller.updateState({
          visitedMap: { ...state.visitedMap, [firstQuestionId]: true },
        });
      }
    }
  }

  getDiagnostics() {
    return { name: "NavigationManager", currentIndex: this.controller?.getState().currentIndex };
  }

  restore(snapshot: any) {}
  destroy() {}
}
