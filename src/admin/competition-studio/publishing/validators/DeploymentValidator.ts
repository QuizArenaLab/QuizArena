import { DeploymentBlueprint, DeploymentLifecycleState } from '../types/PublishingTypes';

export class DeploymentValidator {
  /**
   * Pre-deployment validation of the deployment blueprint.
   */
  public async validate(blueprint: DeploymentBlueprint): Promise<{ valid: boolean; warnings: string[] }> {
    console.log(`[DeploymentValidator] Validating blueprint for artifact ${blueprint.artifactId}`);

    // Mock validation logic
    if (!blueprint.executionSteps || blueprint.executionSteps.length === 0) {
      return { valid: false, warnings: ['No execution steps defined in the blueprint'] };
    }

    // Change state logically, though the orchestrator will persist it
    blueprint.approvalState = DeploymentLifecycleState.VALIDATED;

    return { valid: true, warnings: [] };
  }
}
