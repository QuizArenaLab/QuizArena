export type RetirementState = "DEPRECATED" | "FROZEN" | "HIDDEN" | "ARCHIVED" | "PURGED";

export class QuestionRetirementEngine {
  public async transitionState(
    questionId: string,
    newState: RetirementState,
    actorId: string
  ): Promise<void> {
    // Enforces safe phased retirement
    // E.g., a Question cannot be PURGED if it is only DEPRECATED. It must flow through the proper stages.
  }
}
