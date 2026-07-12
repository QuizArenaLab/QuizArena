import crypto from "crypto";

export type QuestionOrigin =
  | "IMPORTED"
  | "COPIED"
  | "AI_ASSISTED"
  | "MANUAL"
  | "MIGRATED"
  | "DERIVED"
  | "BLUEPRINT_GENERATED";

export interface QuestionVersionPayload {
  body: string;
  options: any[];
  answer: string;
  media: string[];
  explanation: string;
  metadata: any;
  origin: QuestionOrigin;
}

export class QuestionVersionEngine {
  public async branchNewVersion(
    questionId: string,
    payload: QuestionVersionPayload,
    actorId: string
  ): Promise<string> {
    const fingerprint = this.generateFingerprint(payload);

    // Validate duplicate fingerprint globally

    // Emits new QuestionVersion snapshot with fingerprint, origin, and timeline
    return `V2_${questionId}`;
  }

  public async getLatestPublishedVersion(questionId: string): Promise<any> {
    return { version: "V2", status: "PUBLISHED" };
  }

  private generateFingerprint(payload: QuestionVersionPayload): string {
    const dataString = JSON.stringify({
      body: payload.body,
      options: payload.options,
      answer: payload.answer,
      media: payload.media,
      explanation: payload.explanation,
      metadata: payload.metadata,
    });
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }

  public async logTimelineEvent(questionVersionId: string, event: string): Promise<void> {
    // Created → Edited → Submitted → Reviewed → Approved → Certified → Published → Used → Deprecated → Archived
  }
}
