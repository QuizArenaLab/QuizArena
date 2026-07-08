import { TransferPolicy } from '../policies/TransferPolicy';

export interface DelegationConfig {
  delegateId: string;
  startDate: Date;
  endDate: Date;
  autoExpiry: boolean;
}

export class OwnershipManagementService {
  constructor(
    private readonly db: any,
    private readonly transferPolicy: TransferPolicy
  ) {}

  public async transferOwnership(competitionId: string, currentOwnerId: string, targetOwnerId: string, actorId: string, actorRole: string): Promise<void> {
    if (!this.transferPolicy.canTransferOwnership(actorRole, currentOwnerId, targetOwnerId)) {
      throw new Error("Unauthorized to transfer ownership");
    }

    await this.db.competition.update({
      where: { id: competitionId },
      data: { createdById: targetOwnerId } // Assuming createdById is owner
    });

    // Write audit log
  }

  public async delegateOwnership(competitionId: string, config: DelegationConfig, actorId: string, actorRole: string): Promise<void> {
    if (!this.transferPolicy.canDelegateOwnership(actorRole)) {
      throw new Error("Unauthorized to delegate ownership");
    }

    // Write to a Delegation tracking table
    // Register cron or worker to handle autoExpiry if config.autoExpiry is true
  }

  public async revokeDelegation(competitionId: string, delegateId: string, actorId: string): Promise<void> {
    // End delegation early
  }
}
