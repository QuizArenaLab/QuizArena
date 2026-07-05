import { CompetitionArtifact } from '../../competitions/artifacts/CompetitionArtifact';

export interface RuntimeContext {
  artifactId: string;
  artifact: CompetitionArtifact;
  user: { userId: string; roles: string[] };
  attempt: any; // Mapped from AttemptManager
  session: any; // Mapped from SessionManager
  workspaceConfig: any; // Mapped from WorkspaceManager
  eligibility: any;
  featureFlags: any;
}
