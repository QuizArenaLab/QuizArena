/**
 * Publish Impact Engine
 * 
 * Generates a deterministic preview of post-publish consequences.
 */

export interface ImpactPreviewItem {
  id: string;
  description: string;
  icon: '✓' | '⚠' | 'ℹ';
}

class PublishImpactEngineService {
  generatePreview(domainScores: Record<string, number>): ImpactPreviewItem[] {
    const impacts: ImpactPreviewItem[] = [
      { id: 'freeze', description: 'Competition Version will be permanently frozen.', icon: '✓' },
      { id: 'runtime', description: 'Runtime Snapshot will be generated and distributed.', icon: '✓' },
      { id: 'leaderboard', description: 'Leaderboard structure will be initialized.', icon: '✓' }
    ];

    if (domainScores.publishing < 50) {
      impacts.push({ id: 'warn', description: 'Publishing without complete metadata may affect searchability.', icon: '⚠' });
    }

    return impacts;
  }
}

export const PublishImpactEngine = new PublishImpactEngineService();
