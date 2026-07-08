export class EmergencyOperationsEngine {
  constructor(
    private readonly db: any,
    private readonly auditEngine: any,
    private readonly notificationService: any
  ) {}

  public async pause(competitionId: string, mode: 'SOFT' | 'HARD', actor: string, reason: string): Promise<void> {
    if (mode === 'SOFT') {
      // Soft pause: stop new registrations, let current candidates finish
      await this.db.competition.update({
        where: { id: competitionId },
        data: { status: 'SOFT_PAUSED' }
      });
    } else {
      // Hard pause: immediately terminate sessions
      await this.db.competition.update({
        where: { id: competitionId },
        data: { status: 'HARD_PAUSED' }
      });
      // Call Runtime engine to forcefully evict active sessions
    }

    const timelineEntry = await this.db.platformIncident.create({
      data: {
        competitionId,
        type: `EMERGENCY_${mode}_PAUSE`,
        reason,
        triggeredBy: actor,
        systemsAffected: mode === 'HARD' ? 'RUNTIME, REGISTRATION' : 'REGISTRATION',
        status: 'ACTIVE'
      }
    });

    await this.notificationService.notifyEmergency(competitionId, mode, reason);
    await this.auditEngine.logAction(competitionId, actor, `EMERGENCY_PAUSE_${mode}`, reason);
  }

  public async resume(competitionId: string, actor: string, reason: string): Promise<void> {
    await this.db.competition.update({
      where: { id: competitionId },
      data: { status: 'ACTIVE' }
    });

    // Close the incident
    await this.db.platformIncident.updateMany({
      where: { competitionId, status: 'ACTIVE' },
      data: { status: 'RESOLVED', resolvedAt: new Date(), resolutionNotes: reason }
    });

    await this.auditEngine.logAction(competitionId, actor, 'EMERGENCY_RESUME', reason);
  }
}
