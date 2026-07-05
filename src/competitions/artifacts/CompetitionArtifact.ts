import { ArtifactStatus } from './ArtifactStatus';

export interface ArtifactManifest {
  schemaVersion: string;
  artifactVersion: string;
  builderVersion: string;
  platformVersion: string;
  runtimeCompatibilityVersion: string;
  buildNumber: number;
  createdWithGitCommit?: string;
}

export interface CompetitionArtifact {
  artifactId: string;
  versionId: string;
  snapshotHash: string;
  manifestHash: string;
  artifactHash: string;
  artifactSignature?: string; // For cryptographic verification
  status: ArtifactStatus;
  serializedPayload: string; // The immutable snapshot data
  manifest: ArtifactManifest;
  compatibilityReport: any;
  dependencies: string[];
  integrityReport: any;
}
