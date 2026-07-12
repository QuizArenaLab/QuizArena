export type QuestionId = string;
export type VersionId = string;
export type AuthorId = string;
export type SourceId = string;
export type ExternalId = string;

export interface QuestionIdentity {
  id: QuestionId;
  version: VersionId;
  authorId: AuthorId;
  sourceId?: SourceId;
  externalId?: ExternalId;
}
