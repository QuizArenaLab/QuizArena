import type { RuntimeController } from "../core/RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export interface IRuntimeManager {
  /**
   * Called when the RuntimeHost is initializing the runtime.
   */
  initialize(controller: RuntimeController): void | Promise<void>;

  /**
   * Called when the RuntimeHost is destroying the runtime.
   * Clean up timers, listeners, and resources.
   */
  destroy(): void;

  /**
   * Handle incoming commands dispatched via the CommandBus.
   * A manager should only process commands it owns.
   */
  handleCommand(cmd: RuntimeCommand): void | Promise<void>;

  /**
   * Handle incoming events dispatched via the EventBus.
   * A manager should only react to events it cares about.
   */
  handleEvent(evt: RuntimeEvent): void | Promise<void>;

  /**
   * Return diagnostics specific to this manager.
   */
  getDiagnostics(): Record<string, any>;

  /**
   * Called during a crash recovery flow to restore state from a snapshot.
   */
  restore(snapshot: any): void | Promise<void>;
}
