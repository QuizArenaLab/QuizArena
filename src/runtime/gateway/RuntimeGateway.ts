import { RuntimeKernel } from '../kernel/RuntimeKernel';
import { RuntimeContext } from '../context/RuntimeContext';

export class RuntimeGateway {
  constructor(private kernel: RuntimeKernel) {}

  /**
   * Exclusive entry point into the Competition Runtime Engine.
   * Hydrates the context and delegates to the kernel.
   */
  public async enterCompetition(artifactId: string, user: any): Promise<void> {
    console.log(`[RuntimeGateway] User ${user.userId} entering competition ${artifactId}`);

    // 1. Resolve Artifact (mocked here, should use ArtifactResolver)
    const artifact = { artifactId, manifest: {} } as any;

    // 2. Build single immutable RuntimeContext
    const context: RuntimeContext = {
      artifactId,
      artifact,
      user,
      attempt: {},
      session: { id: `sess-${Date.now()}` },
      workspaceConfig: {},
      eligibility: {},
      featureFlags: {}
    };

    // 3. Boot Runtime
    await this.kernel.boot(context);
    console.log('[RuntimeGateway] Runtime booted successfully');
  }
}
