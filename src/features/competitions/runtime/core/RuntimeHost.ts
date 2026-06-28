import { RuntimeController } from "./RuntimeController";
import { SessionManager } from "../managers/SessionManager";
import { AnswerManager } from "../managers/AnswerManager";
import { NavigationManager } from "../managers/NavigationManager";
import { TimerManager } from "../managers/TimerManager";
import { AutoSaveManager } from "../managers/AutoSaveManager";
import { ConnectionManager } from "../managers/ConnectionManager";
import { SubmissionManager } from "../managers/SubmissionManager";
import { SecurityManager } from "../managers/SecurityManager";
import { RuntimeRecoveryManager } from "../managers/RuntimeRecoveryManager";
import type { RuntimeState, RuntimeStatus } from "../types/runtime.types";
import type { WorkspaceInitPayload } from "@/types/competition-experience";

export class RuntimeHost {
  private state: RuntimeState;
  private listeners: Set<() => void> = new Set();

  public controller!: RuntimeController;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): RuntimeState {
    return {
      sessionId: "",
      competitionId: "",
      competitionSlug: "",
      competitionTitle: "",
      status: "CREATING" as RuntimeStatus,
      connectionStatus: "Connected",

      serverExpiresAt: "",
      remainingSeconds: 0,

      questions: [],
      currentIndex: 0,

      answers: {},
      visitedMap: {},
      reviewMap: {},

      mutationQueueSize: 0,
      lastSyncAt: null,
      initializedAt: null,
      recoveryCount: 0,
      totalQuestions: 0,

      showMobilePalette: false,
    };
  }

  public getState = (): RuntimeState => {
    return this.state;
  };

  public updateState = (partial: Partial<RuntimeState>) => {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  };

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public async boot(payload: WorkspaceInitPayload) {
    try {
      this.updateState({ status: "BOOTING" });
      this.controller = new RuntimeController(this.getState, this.updateState);

      // Register standard managers
      this.controller.registry.register("Session", new SessionManager());
      this.controller.registry.register("Answer", new AnswerManager());
      this.controller.registry.register("Navigation", new NavigationManager());
      this.controller.registry.register("Timer", new TimerManager());
      this.controller.registry.register("AutoSave", new AutoSaveManager());
      this.controller.registry.register("Connection", new ConnectionManager());
      this.controller.registry.register("Submission", new SubmissionManager());
      this.controller.registry.register("Security", new SecurityManager());
      this.controller.registry.register("Recovery", new RuntimeRecoveryManager());

      this.updateState({ status: "INITIALIZING" });
      await this.controller.registry.initializeAll(this.controller);

      // Hydrate state from payload (This logic used to be in SessionManager initialize,
      // but it's cleaner to dispatch a SessionStarted event or let SessionManager handle it)
      // We will let SessionManager handle it via an event or direct command.
      this.controller.commands.dispatch("InitializeSession", payload);
    } catch (err) {
      console.error("[RuntimeHost] Failed to boot:", err);
      this.recoverFromFatalError(err);
    }
  }

  public destroy() {
    this.updateState({ status: "DESTROYING" });
    if (this.controller) {
      this.controller.registry.destroyAll();
    }
    this.updateState({ status: "DESTROYED" });
    this.listeners.clear();
  }

  public getDiagnostics() {
    return {
      status: this.state.status,
      managers: this.controller ? this.controller.registry.getDiagnostics() : {},
      stateSnapshot: this.state,
    };
  }

  public async recoverFromFatalError(err: any) {
    console.warn("[RuntimeHost] Initiating fatal error recovery...", err);
    this.updateState({ status: "ERROR" });

    if (!this.controller) return;

    // Freeze Runtime
    const snapshot = this.controller.createSnapshot();

    // Destroy Managers
    this.controller.registry.destroyAll();

    // Recreate Runtime
    this.controller = new RuntimeController(this.getState, this.updateState);

    // Register standard managers
    this.controller.registry.register("Session", new SessionManager());
    this.controller.registry.register("Answer", new AnswerManager());
    this.controller.registry.register("Navigation", new NavigationManager());
    this.controller.registry.register("Timer", new TimerManager());
    this.controller.registry.register("AutoSave", new AutoSaveManager());
    this.controller.registry.register("Connection", new ConnectionManager());
    this.controller.registry.register("Submission", new SubmissionManager());
    this.controller.registry.register("Security", new SecurityManager());
    this.controller.registry.register("Recovery", new RuntimeRecoveryManager());

    await this.controller.registry.initializeAll(this.controller);

    // Restore Snapshot
    this.updateState({ status: "RESTORING_SESSION" as RuntimeStatus });
    await this.controller.registry.restoreAll(snapshot);

    this.updateState({ status: "READY" });
  }
}
