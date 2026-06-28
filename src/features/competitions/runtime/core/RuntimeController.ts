import { EventBus } from "../events/EventBus";
import { CommandBus } from "../commands/CommandBus";
import { RuntimeRegistry } from "./RuntimeRegistry";
import type { RuntimeState } from "../types/runtime.types";

export class RuntimeController {
  public readonly events = new EventBus();
  public readonly commands = new CommandBus();
  public readonly registry = new RuntimeRegistry();

  private _getState: () => RuntimeState;
  private _updateState: (partial: Partial<RuntimeState>) => void;

  constructor(getState: () => RuntimeState, updateState: (partial: Partial<RuntimeState>) => void) {
    this._getState = getState;
    this._updateState = updateState;

    // Route commands to registry automatically
    this.commands.subscribe(async (cmd: any) => {
      try {
        await this.registry.handleCommand(cmd);
      } catch (err) {
        console.error(`[RuntimeController] Error handling command ${cmd.commandType}:`, err);
      }
    });

    // Route events to registry automatically
    this.events.subscribeAll(async (evt: any) => {
      try {
        await this.registry.handleEvent(evt);
      } catch (err) {
        console.error(`[RuntimeController] Error handling event ${evt.eventType}:`, err);
      }
    });
  }

  public getState(): RuntimeState {
    return this._getState();
  }

  public updateState(partial: Partial<RuntimeState>) {
    this._updateState(partial);
  }

  public createSnapshot() {
    return JSON.parse(JSON.stringify(this.getState()));
  }
}
