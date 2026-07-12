export type CertificationState = "NOT_CERTIFIED" | "CERTIFIED" | "EXPIRED" | "REVOKED";

export class QuestionCertificationEngine {
  public async certify(questionVersionId: string, reviewerId: string): Promise<void> {
    // Only published versions can be certified
    // Update certification state to CERTIFIED
  }

  public async revoke(questionVersionId: string, reason: string): Promise<void> {
    // Update state to REVOKED
  }
}
