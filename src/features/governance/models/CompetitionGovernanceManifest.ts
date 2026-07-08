export class CompetitionGovernanceManifest {
  constructor(
    public readonly competitionId: string,
    public readonly lifecycleVersion: number,
    public readonly policyVersion: number,
    public readonly approvalVersion: number,
    public readonly deploymentVersion: number,
    public readonly scheduleVersion: number,
    public readonly healthVersion: number,
    public readonly certificationVersion: number,
    public readonly generatedAt: Date = new Date()
  ) {}

  public serialize(): string {
    return JSON.stringify(this);
  }

  public static deserialize(jsonString: string): CompetitionGovernanceManifest {
    const data = JSON.parse(jsonString);
    return new CompetitionGovernanceManifest(
      data.competitionId,
      data.lifecycleVersion,
      data.policyVersion,
      data.approvalVersion,
      data.deploymentVersion,
      data.scheduleVersion,
      data.healthVersion,
      data.certificationVersion,
      new Date(data.generatedAt)
    );
  }
}
