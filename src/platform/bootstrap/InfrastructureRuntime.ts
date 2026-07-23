/**
 * QuizArena — Infrastructure Runtime Policy
 * 
 * Centralizes runtime environment checks to determine what background processes
 * and infrastructure components are allowed to start.
 */
export class InfrastructureRuntime {
  /**
   * Defines the policy for whether background workers (like OutboxRelay or EventSubscribers)
   * should boot in the current Node process.
   * 
   * Workers should NEVER boot during the Next.js static build phase.
   */
  static canStartBackgroundWorkers(): boolean {
    // 1. Only allow background workers in standard nodejs environments
    if (process.env.NEXT_RUNTIME === "edge") {
      return false;
    }

    // 2. Prevent workers from starting during Next.js build (static generation)
    // Next.js sets NEXT_PHASE during build
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return false;
    }

    // Additional policies can be added here (e.g. dedicated worker scaling flags)
    // if (process.env.DISABLE_BACKGROUND_WORKERS === "true") return false;

    return true;
  }

  /**
   * Determines if the application is currently running the static production build.
   */
  static isBuildPhase(): boolean {
    return process.env.NEXT_PHASE === "phase-production-build";
  }
}
