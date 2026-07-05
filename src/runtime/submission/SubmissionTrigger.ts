import { RuntimeContext } from '../context/RuntimeContext';
import { SubmissionGateway } from './SubmissionGateway';
import { SubmissionPackage } from './SubmissionPackage';

export class SubmissionTrigger {
  constructor(private gateway: SubmissionGateway) {}

  /**
   * Packages the final answer payload and cleanly hands off.
   */
  public async trigger(context: RuntimeContext, finalAnswers: any, reviewFlags: string[]): Promise<void> {
    console.log(`[SubmissionTrigger] Triggering submission for attempt ${context.attempt?.attemptId}`);
    
    const payload: SubmissionPackage = {
      attemptId: context.attempt?.attemptId || 'unknown',
      competitionArtifactId: context.artifactId,
      runtimeVersion: '1.0.0', // from context or manifest
      answers: finalAnswers,
      reviewFlags,
      duration: 3600, // calculated from startedAt
      startedAt: new Date(Date.now() - 3600000),
      submittedAt: new Date(),
      deviceMetadata: {}, // gathered from session
      connectionMetadata: {},
      integrityMetadata: {} // from IntegrityManager
    };

    await this.gateway.submit(payload);
  }
}
