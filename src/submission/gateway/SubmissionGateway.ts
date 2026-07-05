import { SubmissionKernel } from '../kernel/SubmissionKernel';
import { SubmissionContext } from '../context/SubmissionContext';
import { SubmissionPackage } from '../../runtime/submission/SubmissionPackage';

export class SubmissionGateway {
  constructor(private kernel: SubmissionKernel) {}

  /**
   * The exclusive entry point for the Submission Engine.
   */
  public async receiveSubmission(pkg: SubmissionPackage): Promise<void> {
    console.log(`[SubmissionGateway] Receiving submission for attempt ${pkg.attemptId}`);
    
    // Create immutable context from package
    const context: SubmissionContext = {
      package: pkg
    };

    // Trigger evaluation
    await this.kernel.evaluate(context);
    console.log('[SubmissionGateway] Processed submission');
  }
}
