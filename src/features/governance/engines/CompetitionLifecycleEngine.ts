export type CompetitionLifecycleState = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'READY_TO_FREEZE'
  | 'FROZEN'
  | 'READY_TO_PUBLISH'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'LIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'ARCHIVED';

export class CompetitionLifecycleEngine {
  constructor(private readonly db: any) {}

  public async transition(competitionId: string, newState: CompetitionLifecycleState, actor: string, reason?: string): Promise<void> {
    const competition = await this.db.competition.findUnique({ where: { id: competitionId } });
    if (!competition) throw new Error('Competition not found');

    const previousState = competition.lifecycleState;
    if (!this.isValidTransition(previousState, newState)) {
      throw new Error(`Invalid lifecycle transition from ${previousState} to ${newState}`);
    }

    await this.db.$transaction(async (tx: any) => {
      // Update state
      await tx.competition.update({
        where: { id: competitionId },
        data: {
          lifecycleState: newState,
          lastLifecycleUpdate: new Date(),
          lastLifecycleActor: actor
        }
      });

      // Audit trail
      await tx.competitionLifecycleAudit.create({
        data: {
          competitionId,
          previousState,
          newState,
          reason,
          performedBy: actor,
          performedByType: 'USER' // or SYSTEM based on context
        }
      });
    });
  }

  private isValidTransition(from: string, to: CompetitionLifecycleState): boolean {
    // Valid transitions map
    const validTransitions: Record<string, CompetitionLifecycleState[]> = {
      'DRAFT': ['UNDER_REVIEW', 'ARCHIVED'],
      'UNDER_REVIEW': ['DRAFT', 'APPROVED'], // Draft = rejected
      'APPROVED': ['READY_TO_FREEZE'],
      'READY_TO_FREEZE': ['FROZEN'],
      'FROZEN': ['READY_TO_PUBLISH'],
      'READY_TO_PUBLISH': ['PUBLISHED'],
      'PUBLISHED': ['SCHEDULED'],
      'SCHEDULED': ['LIVE', 'PAUSED'],
      'LIVE': ['PAUSED', 'COMPLETED'],
      'PAUSED': ['LIVE', 'ARCHIVED', 'COMPLETED'],
      'COMPLETED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    return validTransitions[from]?.includes(to) ?? false;
  }
}
