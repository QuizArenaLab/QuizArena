import type { IRuntimeManager } from "../managers/IRuntimeManager";
import type { RuntimeController } from "./RuntimeController";
import type { RuntimeCommand, RuntimeEvent } from "../types/runtime.types";

export class RuntimeRegistry {
  private managers = new Map<string, IRuntimeManager>();

  register(name: string, manager: IRuntimeManager) {
    if (this.managers.has(name)) {
      throw new Error(`Manager [${name}] is already registered.`);
    }
    this.managers.set(name, manager);
  }

  getManager<T extends IRuntimeManager>(name: string): T | undefined {
    return this.managers.get(name) as T;
  }

  async initializeAll(controller: RuntimeController) {
    for (const [name, manager] of this.managers) {
      await manager.initialize(controller);
    }
  }

  async handleCommand(cmd: RuntimeCommand) {
    for (const [name, manager] of this.managers) {
      await manager.handleCommand(cmd);
    }
  }

  async handleEvent(evt: RuntimeEvent) {
    for (const [name, manager] of this.managers) {
      await manager.handleEvent(evt);
    }
  }

  async restoreAll(snapshot: any) {
    for (const [name, manager] of this.managers) {
      await manager.restore(snapshot);
    }
  }

  getDiagnostics(): Record<string, any> {
    const diagnostics: Record<string, any> = {};
    for (const [name, manager] of this.managers) {
      diagnostics[name] = manager.getDiagnostics();
    }
    return diagnostics;
  }

  destroyAll() {
    for (const [name, manager] of this.managers) {
      try {
        manager.destroy();
      } catch (err) {
        console.error(`Error destroying manager [${name}]:`, err);
      }
    }
    this.managers.clear();
  }
}
