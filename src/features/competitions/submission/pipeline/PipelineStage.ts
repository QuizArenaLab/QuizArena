import { PipelineContext } from "../types/pipeline.types";
import { PrismaClient } from "@prisma/client";

export interface IPipelineStage {
  /**
   * Validates if the stage can be executed given the current context.
   */
  validate(context: PipelineContext, tx: any): Promise<boolean>;

  /**
   * Executes the core logic of the pipeline stage.
   * Modifies the context in-place.
   */
  execute(context: PipelineContext, tx: any): Promise<void>;

  /**
   * Optional rollback logic if the transaction fails after this stage.
   * Handled by Prisma transaction boundaries automatically for DB, but useful for external systems.
   */
  rollback?(context: PipelineContext): Promise<void>;

  /**
   * Returns diagnostic metadata about the stage execution (e.g., timings, flags).
   */
  getDiagnostics(): any;
}
