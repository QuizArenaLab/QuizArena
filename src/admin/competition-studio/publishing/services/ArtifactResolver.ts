import { CompetitionArtifact } from '../../../../competitions/artifacts/CompetitionArtifact';

export class ArtifactResolver {
  /**
   * Resolves a CompetitionArtifact by ID.
   * This ensures the Planner never queries the database directly.
   */
  public async resolveArtifact(artifactId: string): Promise<CompetitionArtifact> {
    // Mock implementation for Phase 07
    // In reality, this would fetch from ArtifactRegistry or a blob store
    console.log(`[ArtifactResolver] Resolving artifact ${artifactId}`);
    return {} as CompetitionArtifact;
  }
}
