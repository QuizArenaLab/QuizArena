export class TransferPolicy {
  public canTransferOwnership(actorRole: string, currentOwnerId: string, targetActorId: string): boolean {
    if (actorRole === 'SUPER_ADMIN') return true;
    if (actorRole === 'OWNER' && currentOwnerId === targetActorId) return true;
    return false;
  }
  
  public canDelegateOwnership(actorRole: string): boolean {
    return actorRole === 'SUPER_ADMIN' || actorRole === 'OWNER';
  }
}
