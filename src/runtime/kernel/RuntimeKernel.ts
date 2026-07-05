import { RuntimeContext } from '../context/RuntimeContext';
import { EligibilityEngine } from '../services/EligibilityEngine';
import { SessionManager } from '../services/SessionManager';
import { WorkspaceManager } from '../workspace/WorkspaceManager';
import { NavigationManager } from '../services/NavigationManager';
import { AnswerStateManager } from '../services/AnswerStateManager';
import { AutoSavePipeline } from '../services/AutoSavePipeline';
import { RecoveryManager } from '../services/RecoveryManager';

export class RuntimeKernel {
  constructor(
    private eligibility: EligibilityEngine,
    private sessionManager: SessionManager,
    private workspaceManager: WorkspaceManager,
    private navigationManager: NavigationManager,
    private answerStateManager: AnswerStateManager,
    private syncPipeline: AutoSavePipeline,
    private recoveryManager: RecoveryManager
  ) {}

  /**
   * Orchestrates the deterministic boot sequence.
   */
  public async boot(context: RuntimeContext): Promise<void> {
    console.log(`[RuntimeKernel] Booting runtime for session ${context.session?.id}`);
    
    // 1. Check Eligibility
    const eligibilityResult = await this.eligibility.evaluate(context);
    if (!eligibilityResult.isEligible) throw new Error('Ineligible');

    // 2. Initialize Session
    await this.sessionManager.initializeSession(context);

    // 3. Setup Workspace
    await this.workspaceManager.initializeWorkspace(context);

    // 4. Setup Navigation & Answer State (implicit readiness)
    
    // 5. Attempt Recovery
    const snapshot = await this.recoveryManager.recoverSession(context);
    if (snapshot) {
      console.log('[RuntimeKernel] Recovered from snapshot', snapshot.snapshotId);
      // Hydrate state managers
    }
  }
}
