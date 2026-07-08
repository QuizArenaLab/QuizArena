import { ProposedSchedule } from './SchedulePlanner';

export class ScheduleExecutor {
  constructor(
    private readonly db: any,
    private readonly lifecycleEngine: any,
    private readonly auditEngine: any
  ) {}

  public async execute(competitionId: string, schedule: ProposedSchedule, actor: string): Promise<void> {
    await this.db.competitionSchedule.create({
      data: {
        competitionId,
        publishAt: schedule.publishAt,
        startsAt: schedule.startAt,
        endsAt: schedule.endAt,
        timezone: schedule.timezone
      }
    });

    await this.lifecycleEngine.transition(competitionId, 'SCHEDULED', actor);
    await this.auditEngine.logAction(competitionId, actor, 'SCHEDULE_APPLIED');
  }
}
