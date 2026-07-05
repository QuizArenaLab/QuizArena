import { PlatformManifest } from '../models/PlatformManifest';

export interface WorkflowExecutionContext {
  readonly workflowId: string;
  readonly correlationId: string;
  readonly platformManifest: PlatformManifest;
  readonly userContext: any; // e.g., userId, roles
  readonly environment: string;
  readonly featureFlags: Record<string, boolean>;
  readonly policySnapshot: any;
}
