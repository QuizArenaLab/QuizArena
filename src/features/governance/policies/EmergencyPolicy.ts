export class EmergencyPolicy {
  public canInitiateEmergencyAction(actorRole: string): boolean {
    return actorRole === 'SUPER_ADMIN' || actorRole === 'INCIDENT_COMMANDER';
  }

  public requiresPostMortem(emergencyType: 'SOFT_PAUSE' | 'HARD_PAUSE'): boolean {
    return emergencyType === 'HARD_PAUSE';
  }
}
