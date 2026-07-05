import { RankingManifest } from '../../models/RankingSnapshots';

export class RankingManifestBuilder {
  public build(
    candidateCount: number,
    rankingCount: number,
    generationDuration: number,
    submissionVersion: string
  ): RankingManifest {
    return {
      schemaVersion: '1.0',
      algorithmVersion: '1.0', // Could be dynamic based on policies
      generatedAt: new Date(),
      materializerVersion: '1.0',
      platformVersion: '1.0', // Get from platform config
      artifactVersion: '1.0', // Get from competition context
      generatedBy: 'System', // Could be Admin ID if manual
      generationDuration,
      candidateCount,
      rankingCount,
      runtimeVersion: '1.0', // From context
      submissionVersion
    };
  }
}
