import type { IRuntimeManager } from "./IRuntimeManager";
import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class AnswerManager implements IRuntimeManager {
  private controller!: RuntimeController;

  initialize(controller: RuntimeController) {
    this.controller = controller;
  }

  async handleCommand(cmd: RuntimeCommand) {
    if (cmd.commandType === "SelectAnswer") {
      const { questionId, optionId } = cmd.payload;
      const state = this.controller.getState();

      const newAnswers = { ...state.answers, [questionId]: optionId };
      this.controller.updateState({ answers: newAnswers });

      this.controller.events.emit("AnswerChanged", { questionId, optionId }, state.sessionId);
    } else if (cmd.commandType === "ToggleReviewMark") {
      const questionId = String(cmd.payload.questionId);
      const state = this.controller.getState();

      const newReviewMap: Record<string, boolean> = {
        ...state.reviewMap,
        [questionId]: !state.reviewMap[questionId],
      };
      this.controller.updateState({ reviewMap: newReviewMap });

      this.controller.events.emit(
        "ReviewMarkChanged",
        { questionId, isMarked: newReviewMap[questionId] },
        state.sessionId
      );
    }
  }

  async handleEvent(evt: RuntimeEvent) {
    // No-op
  }

  getDiagnostics() {
    return {
      name: "AnswerManager",
      totalAnswers: Object.keys(this.controller.getState().answers).length,
    };
  }

  restore(snapshot: any) {}

  destroy() {}
}
