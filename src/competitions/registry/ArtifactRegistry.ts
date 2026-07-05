import { CompetitionArtifact } from '../artifacts/CompetitionArtifact';

export class ArtifactRepository {
  private artifacts: Map<string, CompetitionArtifact> = new Map();

  public save(artifact: CompetitionArtifact): void {
    if (this.artifacts.has(artifact.artifactId)) throw new Error('Artifacts are immutable and cannot be overwritten.');
    this.artifacts.set(artifact.artifactId, artifact);
  }

  public get(artifactId: string): CompetitionArtifact | undefined {
    return this.artifacts.get(artifactId);
  }
}

export class ArtifactResolver {
  constructor(private repo: ArtifactRepository) {}

  public resolveCompatible(versionId: string): CompetitionArtifact | undefined {
    // Logic to find the latest compatible version
    return undefined;
  }
}

export class ArtifactRegistry {
  private static instance: ArtifactRegistry;
  private resolver!: ArtifactResolver;
  
  private constructor() {}
  
  public static getInstance(): ArtifactRegistry {
    if (!ArtifactRegistry.instance) {
      ArtifactRegistry.instance = new ArtifactRegistry();
    }
    return ArtifactRegistry.instance;
  }

  public setResolver(resolver: ArtifactResolver) {
    this.resolver = resolver;
  }

  public fetch(versionId: string): CompetitionArtifact {
    const artifact = this.resolver.resolveCompatible(versionId);
    if (!artifact) throw new Error('No compatible artifact found.');
    return artifact;
  }
}
