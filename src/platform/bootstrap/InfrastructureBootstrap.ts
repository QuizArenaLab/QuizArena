import { validateStartupConfig } from "../config/startupValidator";
import { InfrastructureRuntime } from "./InfrastructureRuntime";
import { initializeEventBus } from "../../infrastructure/events/EventRegistry";
import { platformOutboxRelay } from "../../infrastructure/events/OutboxRelay";

/**
 * QuizArena — Infrastructure Bootstrap
 * 
 * The absolute central point for all infrastructure initialization.
 * Guaranteed to only run once per Node process via Next.js instrumentation.
 */
export class InfrastructureBootstrap {
  private static isBootstrapped = false;

  static async start() {
    if (this.isBootstrapped) return;
    this.isBootstrapped = true;

    console.log("[Infrastructure] Bootstrapping Application Environment...");

    // 1. Validation
    // Validates that all required environment variables are present before booting anything else.
    validateStartupConfig();

    // 2. Worker & Background Service Policy Check
    if (!InfrastructureRuntime.canStartBackgroundWorkers()) {
      console.log("[Infrastructure] Build/Edge context detected. Background workers will remain suspended.");
      return;
    }

    console.log("[Infrastructure] Starting background workers & services...");

    // 3. Independent Service Boot
    // By keeping these independent, if one fails, others can still operate or fail gracefully.
    try {
      this.startEventRegistry();
    } catch (e) {
      console.error("[Infrastructure] Failed to start EventRegistry:", e);
    }

    try {
      this.startOutboxRelay();
    } catch (e) {
      console.error("[Infrastructure] Failed to start OutboxRelay:", e);
    }

    // Cron initialization can be added here once implemented properly

    console.log("[Infrastructure] Bootstrap Complete.");
  }

  private static startEventRegistry() {
    initializeEventBus();
  }

  private static startOutboxRelay() {
    platformOutboxRelay.start();
  }
}
