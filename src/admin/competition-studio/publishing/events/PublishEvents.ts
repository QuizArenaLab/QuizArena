export interface PublishEvent {
  eventId: string;
  timestamp: Date;
  artifactId: string;
  executionId: string;
}

export interface DeploymentPlanned extends PublishEvent {
  type: 'DeploymentPlanned';
  blueprint: any;
}

export interface DeploymentValidated extends PublishEvent {
  type: 'DeploymentValidated';
  validationResults: any;
}

export interface DeploymentStarted extends PublishEvent {
  type: 'DeploymentStarted';
}

export interface DeploymentActivated extends PublishEvent {
  type: 'DeploymentActivated';
}

export interface DeploymentVerified extends PublishEvent {
  type: 'DeploymentVerified';
  verificationResults: any;
}

export interface DeploymentHealthy extends PublishEvent {
  type: 'DeploymentHealthy';
  healthReport: any;
}

export interface CompetitionPublished extends PublishEvent {
  type: 'CompetitionPublished';
  publishReport: any;
}
