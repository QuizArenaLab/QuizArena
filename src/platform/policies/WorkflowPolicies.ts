export interface WorkflowPolicyConfig {
  maxExecutionTimeMs: number;
  retryOnFailure: boolean;
  maxRetries: number;
  compensationTimeoutMs: number;
}

export const DefaultWorkflowPolicies: Record<string, WorkflowPolicyConfig> = {
  'SubmissionProcessingWorkflow': {
    maxExecutionTimeMs: 30000,
    retryOnFailure: true,
    maxRetries: 3,
    compensationTimeoutMs: 10000
  },
  'CompetitionPublishWorkflow': {
    maxExecutionTimeMs: 60000,
    retryOnFailure: false,
    maxRetries: 0,
    compensationTimeoutMs: 0
  }
};
