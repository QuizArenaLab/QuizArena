export interface LockStatus {
  isLocked: boolean;
  lockedAt: Date | null;
  lockedBy: string | null;
  reason: string | null;
}

export class CompetitionLock {
  public editLock: LockStatus = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };
  public ownershipLock: LockStatus = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };
  public pricingLock: LockStatus = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };
  public runtimeLock: LockStatus = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };
  public certificateLock: LockStatus = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };

  constructor(public readonly competitionId: string) {}

  public lockAll(actor: string, reason: string): void {
    const now = new Date();
    const status = { isLocked: true, lockedAt: now, lockedBy: actor, reason };
    
    this.editLock = { ...status };
    this.ownershipLock = { ...status };
    this.pricingLock = { ...status };
    this.runtimeLock = { ...status };
    this.certificateLock = { ...status };
  }

  public unlockAll(actor: string, reason: string): void {
    const status = { isLocked: false, lockedAt: null, lockedBy: null, reason: null };
    
    this.editLock = { ...status };
    this.ownershipLock = { ...status };
    this.pricingLock = { ...status };
    this.runtimeLock = { ...status };
    this.certificateLock = { ...status };
  }
}
