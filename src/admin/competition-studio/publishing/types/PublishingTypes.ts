export enum DeploymentLifecycleState {
  PLANNED = 'PLANNED',
  VALIDATED = 'VALIDATED',
  READY = 'READY',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  DEPLOYING = 'DEPLOYING',
  VERIFYING = 'VERIFYING',
  ACTIVATING = 'ACTIVATING',
  LIVE = 'LIVE',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
  ARCHIVED = 'ARCHIVED'
}

export interface ExecutionStep {
  id: string;
  order: number;
  name: string;
  description: string;
  action: string;
  parameters: Record<string, any>;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface RollbackBlueprint {
  targetArtifactId: string;
  steps: ExecutionStep[];
  dependencies: string[];
  verificationPlan: any;
}

export interface DeploymentBlueprint {
  artifactId: string;
  environment: string;
  dependencies: string[];
  deploymentStrategy: string;
  activationMode: string;
  rollbackPlan: RollbackBlueprint;
  validationPlan: any;
  verificationPlan: any;
  monitoringPlan: any;
  approvalState: DeploymentLifecycleState;
  executionId: string;
  executionSteps: ExecutionStep[];
  compatibilityMetadata: any;
}

export interface DeploymentAudit {
  executionId: string;
  execution: any;
  verification: any;
  rollback: any;
  health: any;
  duration: number;
  warnings: string[];
  timestamp: Date;
}

export interface PublishReport {
  blueprint: DeploymentBlueprint;
  metrics: any;
  warnings: string[];
  deploymentTime: number;
  verification: any;
  health: any;
  artifacts: string[];
  events: any[];
}
