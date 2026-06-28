import type { RuntimeCommand } from "../types/runtime.types";

type CommandSubscriber = (command: RuntimeCommand) => void | Promise<void>;

/**
 * Command Bus for routing intents to Managers.
 */
export class CommandBus {
  private subscribers: Set<CommandSubscriber> = new Set();

  subscribe(subscriber: CommandSubscriber) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  async dispatch(commandType: string, payload?: any): Promise<void> {
    for (const subscriber of this.subscribers) {
      try {
        await subscriber({ commandType, payload });
      } catch (error) {
        console.error(`[CommandBus] Error handling command ${commandType}:`, error);
        throw error;
      }
    }
  }

  clear() {
    this.subscribers.clear();
  }
}
