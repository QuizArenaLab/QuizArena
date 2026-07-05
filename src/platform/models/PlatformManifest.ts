export interface PlatformManifest {
  platformVersion: string;
  schemaVersion: string;
  workflowVersion: string;
  compatibilityVersion: string;
  deploymentVersion: string;
  artifactVersion?: string;
  runtimeVersion?: string;
  generatedAt: Date;
}
