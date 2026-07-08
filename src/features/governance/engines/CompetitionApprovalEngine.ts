export enum ApprovalStage {
  TECHNICAL_REVIEW = 'TECHNICAL_REVIEW',
  CONTENT_REVIEW = 'CONTENT_REVIEW',
  BUSINESS_REVIEW = 'BUSINESS_REVIEW',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  FINAL_APPROVAL = 'FINAL_APPROVAL'
}

export class CompetitionApprovalEngine {
  constructor(
    private readonly db: any,
    private readonly auditEngine: any
  ) {}

  public async requestApproval(competitionId: string, actor: string): Promise<void> {
    // Move to first stage of approval
    await this.transitionApprovalStage(competitionId, ApprovalStage.CONTENT_REVIEW, actor);
  }

  public async approveStage(competitionId: string, currentStage: ApprovalStage, actor: string): Promise<void> {
    const nextStage = this.getNextStage(currentStage);
    if (nextStage) {
      await this.transitionApprovalStage(competitionId, nextStage, actor);
    } else {
      // All stages completed
      await this.markFullyApproved(competitionId, actor);
    }
  }

  public async rejectApproval(competitionId: string, stage: ApprovalStage, actor: string, reason: string): Promise<void> {
    await this.auditEngine.logAction(competitionId, actor, `REJECTED_${stage}`, reason);
    // Logic to reset state to DRAFT or REJECTED
  }

  private getNextStage(currentStage: ApprovalStage): ApprovalStage | null {
    // MVP uses only Content Review -> Final Approval
    switch (currentStage) {
      case ApprovalStage.CONTENT_REVIEW:
        return ApprovalStage.FINAL_APPROVAL;
      case ApprovalStage.FINAL_APPROVAL:
        return null;
      default:
        return null; // Fallback
    }
  }

  private async transitionApprovalStage(competitionId: string, stage: ApprovalStage, actor: string): Promise<void> {
    await this.auditEngine.logAction(competitionId, actor, `ENTERED_${stage}`);
  }

  private async markFullyApproved(competitionId: string, actor: string): Promise<void> {
    // Logic to notify Kernel that approval is complete
    await this.auditEngine.logAction(competitionId, actor, 'FULLY_APPROVED');
  }
}
