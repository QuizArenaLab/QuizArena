export class ApprovalPolicy {
  public canApprove(actorRole: string, competitionRiskScore: number): boolean {
    if (actorRole === 'SUPER_ADMIN') return true;
    if (actorRole === 'GOVERNANCE_ADMIN' && competitionRiskScore < 20) return true;
    return false;
  }

  public requiresMultiStageApproval(competitionRiskScore: number): boolean {
    return competitionRiskScore > 10;
  }
}
