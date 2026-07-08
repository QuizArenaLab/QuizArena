export class SchedulingPolicy {
  public canSchedule(actorRole: string, proposedDate: Date): boolean {
    const now = new Date();
    // Cannot schedule in the past
    if (proposedDate < now) return false;
    
    // Only admins can schedule more than 6 months in advance
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    if (proposedDate > sixMonthsLater && actorRole !== 'SUPER_ADMIN') return false;
    
    return true;
  }
}
