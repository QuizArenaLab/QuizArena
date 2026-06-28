import { PipelineContext } from "../../types/pipeline.types";
import { IPipelineStage } from "../PipelineStage";

export class ValidationStage implements IPipelineStage {
  async validate(context: PipelineContext, tx: any): Promise<boolean> {
    if (!context.userId || !context.competitionId || !context.sessionId) {
      throw new Error("Missing critical identifiers in PipelineContext");
    }
    return true;
  }

  async execute(context: PipelineContext, tx: any): Promise<void> {
    // 1. Fetch Session with lock (SELECT FOR UPDATE equivalent in Prisma is slightly tricky, 
    // but Prisma executes $transaction sequentially, and we can check status)
    
    const session = await tx.competitionSession.findUnique({
      where: { id: context.sessionId },
      include: {
        competition: {
          include: {
            config: true,
            questions: {
              include: {
                question: {
                  include: { options: true }
                }
              }
            }
          }
        },
        answers: true,
      }
    });

    if (!session) {
      throw new Error("Competition Session not found");
    }

    if (session.userId !== context.userId) {
      throw new Error("Unauthorized: Session does not belong to user");
    }

    if (session.competitionId !== context.competitionId) {
      throw new Error("Invalid Session: Competition mismatch");
    }

    // Verify it's not already submitted
    if (session.status === "SUBMITTED" || session.status === "COMPLETED") {
      throw new Error("Session is already submitted");
    }

    // Lock session status to SUBMITTING to prevent duplicates
    await tx.competitionSession.update({
      where: { id: session.id },
      data: { status: "SUBMITTING" }
    });

    // Populate context with fetched full models to prevent re-querying
    context.session = session;
    context.competition = session.competition;
    context.answers = session.answers;
    context.config = session.competition.config;
  }

  getDiagnostics() {
    return { name: "ValidationStage" };
  }
}
