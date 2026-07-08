import { ProposedSchedule } from './SchedulePlanner';

export class ConflictValidator {
  constructor(private readonly db: any) {}

  public async validate(schedule: ProposedSchedule, competitionId: string): Promise<{ isValid: boolean; conflicts: string[] }> {
    const conflicts: string[] = [];
    
    // Check overlapping major events
    const overlaps = await this.db.competitionSchedule.findMany({
      where: {
        startsAt: { lte: schedule.endAt },
        endsAt: { gte: schedule.startAt },
        competitionId: { not: competitionId }
      }
    });

    if (overlaps.length > 0) {
      conflicts.push(`Overlap with ${overlaps.length} existing competitions.`);
    }

    return {
      isValid: conflicts.length === 0,
      conflicts
    };
  }
}
