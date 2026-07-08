export class ArchivePolicy {
  public canArchive(competitionStatus: string): boolean {
    // Competitions can only be archived if they are completed, cancelled, or drafts
    return ['COMPLETED', 'CANCELLED', 'DRAFT'].includes(competitionStatus);
  }
}
