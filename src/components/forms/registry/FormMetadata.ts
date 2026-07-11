export interface FormMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerTeam?: string;
  workspace?: string;
  domain?: string;
  category: string;
  version: string;
  status: "draft" | "active" | "deprecated" | "archived";
  tags: string[];
  dependencies: string[];
  estimatedCompletionTimeMs?: number;
}
