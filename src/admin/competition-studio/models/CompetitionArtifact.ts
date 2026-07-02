export interface CompetitionArtifact {
  artifactId: string;
  versionId: string;
  snapshotHash: string;
  manifestHash: string;
  artifactHash: string;
  serializedPayload: string; // The immutable snapshot data
  manifest: any;
  compatibilityReport: any;
  dependencies: string[];
  integrityReport: any;
}
