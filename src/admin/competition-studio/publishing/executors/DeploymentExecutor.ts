import { DeploymentBlueprint, DeploymentLifecycleState } from '../types/PublishingTypes';

export class DeploymentExecutor {
  /**
   * Purely executes precomputed ExecutionSteps sequentially. 
   * Contains ZERO decision-making logic.
   */
  public async execute(blueprint: DeploymentBlueprint): Promise<void> {
    console.log(`[DeploymentExecutor] Executing deployment ${blueprint.executionId}`);

    blueprint.approvalState = DeploymentLifecycleState.DEPLOYING;

    // Execute steps strictly as planned
    for (const step of blueprint.executionSteps) {
      console.log(`[DeploymentExecutor] Running Step ${step.order}: ${step.name}`);
      step.status = 'IN_PROGRESS';
      
      try {
        await this.runStep(step.action, step.parameters);
        step.status = 'COMPLETED';
      } catch (error) {
        step.status = 'FAILED';
        blueprint.approvalState = DeploymentLifecycleState.FAILED;
        throw error;
      }
    }
  }

  private async runStep(action: string, parameters: any): Promise<void> {
    // Mock execution logic
    // A real executor would delegate to specific adapters (Kubernetes, AWS, etc.)
    return new Promise((resolve) => setTimeout(resolve, 50));
  }
}
