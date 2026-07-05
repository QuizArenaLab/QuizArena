import { ArtifactResolver } from '../services/ArtifactResolver';
import { DependencyResolver } from '../services/DependencyResolver';
import { DeploymentPlanner } from '../planners/DeploymentPlanner';
import { DeploymentValidator } from '../validators/DeploymentValidator';
import { DeploymentExecutor } from '../executors/DeploymentExecutor';
import { DeploymentVerificationEngine } from '../services/DeploymentVerificationEngine';
import { DeploymentHealthEngine } from '../services/DeploymentHealthEngine';
import { DeploymentLifecycleState, PublishReport, DeploymentAudit } from '../types/PublishingTypes';

export class DeploymentOrchestrator {
  constructor(
    private artifactResolver: ArtifactResolver,
    private dependencyResolver: DependencyResolver,
    private planner: DeploymentPlanner,
    private validator: DeploymentValidator,
    private executor: DeploymentExecutor,
    private verificationEngine: DeploymentVerificationEngine,
    private healthEngine: DeploymentHealthEngine
  ) {}

  /**
   * Orchestrates the complete publishing lifecycle.
   */
  public async publish(artifactId: string, environment: string): Promise<PublishReport> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const events: any[] = [];
    
    try {
      // 1. Resolve Artifact
      const artifact = await this.artifactResolver.resolveArtifact(artifactId);

      // 2. Resolve Dependencies (Compatibility)
      const compatibility = await this.dependencyResolver.resolveCompatibility(artifact);

      // 3. Plan Deployment
      const blueprint = await this.planner.plan(artifact, compatibility, environment);
      blueprint.approvalState = DeploymentLifecycleState.PLANNED;
      events.push({ type: 'DeploymentPlanned', blueprint, timestamp: new Date() });

      // 4. Validate Deployment
      const validation = await this.validator.validate(blueprint);
      if (!validation.valid) {
        blueprint.approvalState = DeploymentLifecycleState.FAILED;
        throw new Error(`Validation failed: ${validation.warnings.join(', ')}`);
      }
      blueprint.approvalState = DeploymentLifecycleState.VALIDATED;
      warnings.push(...validation.warnings);
      events.push({ type: 'DeploymentValidated', validationResults: validation, timestamp: new Date() });

      // 5. Approval Layer (Auto-approve for MVP)
      blueprint.approvalState = DeploymentLifecycleState.WAITING_APPROVAL;
      // ... assume approval is granted
      blueprint.approvalState = DeploymentLifecycleState.APPROVED;

      // 6. Execute Deployment
      blueprint.approvalState = DeploymentLifecycleState.READY;
      events.push({ type: 'DeploymentStarted', timestamp: new Date() });
      
      await this.executor.execute(blueprint); // Changes state to DEPLOYING internally
      
      blueprint.approvalState = DeploymentLifecycleState.ACTIVATING;
      events.push({ type: 'DeploymentActivated', timestamp: new Date() });

      // 7. Verify Deployment
      const verification = await this.verificationEngine.verify(blueprint);
      if (!verification.verified) {
        blueprint.approvalState = DeploymentLifecycleState.FAILED;
        throw new Error('Verification failed');
      }
      events.push({ type: 'DeploymentVerified', verificationResults: verification.results, timestamp: new Date() });

      // 8. Health Check
      const health = await this.healthEngine.checkHealth(blueprint.executionId);
      if (!health.healthy) {
        blueprint.approvalState = DeploymentLifecycleState.FAILED;
        throw new Error('Health check failed');
      }
      events.push({ type: 'DeploymentHealthy', healthReport: health.report, timestamp: new Date() });

      // 9. Completion
      blueprint.approvalState = DeploymentLifecycleState.LIVE;
      
      const duration = Date.now() - startTime;
      
      const audit: DeploymentAudit = {
        executionId: blueprint.executionId,
        execution: blueprint.executionSteps,
        verification: verification.results,
        rollback: blueprint.rollbackPlan,
        health: health.report,
        duration,
        warnings,
        timestamp: new Date()
      };

      const report: PublishReport = {
        blueprint,
        metrics: { totalDurationMs: duration },
        warnings,
        deploymentTime: duration,
        verification: verification.results,
        health: health.report,
        artifacts: [artifactId],
        events
      };

      events.push({ type: 'CompetitionPublished', publishReport: report, timestamp: new Date() });

      return report;
      
    } catch (error) {
      // In a real system, trigger Rollback mechanism here
      console.error('Deployment failed', error);
      throw error;
    }
  }
}
