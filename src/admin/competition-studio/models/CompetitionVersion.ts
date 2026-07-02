export interface CompetitionVersion {
  id: string;
  competitionId: string;
  metadata: Record<string, any>;
  semanticVersion: string;
  versionNumber: number;
  createdAt: string;
  parentVersionId?: string; // Lineage
  status: 'DRAFT' | 'FROZEN' | 'SUPERSEDED';
}
