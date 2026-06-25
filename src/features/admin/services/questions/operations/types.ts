import type { 
  OperationalIssueSeverity, 
  OperationalIssueStatus, 
  OperationalAuditAction 
} from "@/generated/prisma";

export interface OperationalRuleConfig {
  ruleKey: string;
  enabled: boolean;
  severity: OperationalIssueSeverity;
  threshold: number;
  description: string | null;
}

export interface DetectedIssue {
  questionId: string;
  issueType: string;
  severity: OperationalIssueSeverity;
  details?: Record<string, unknown>;
}

export interface OperationsEvaluationResult {
  detectedIssues: DetectedIssue[];
  autoResolvedIssueIds: string[];
  durationMs: number;
}
