export interface DomainBootContract {
  domainId: string;
  initialize(): Promise<void>;
  registerCapabilities(registry: any): void; // Will type as PlatformCapabilityRegistry later
  registerCommands(registry: any): void;     // Will type as PlatformCommandRegistry later
  registerEvents(registry: any): void;       // Will type as PlatformEventRegistry later
  registerPolicies(registry: any): void;     // Will type as PlatformConfigurationEngine later
  healthCheck(): Promise<DomainHealthReport>;
  shutdown(): Promise<void>;
}

export interface DomainHealthReport {
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED';
  version: string;
  uptimeSeconds: number;
  lastEventAt: Date | null;
  pendingJobs: number;
  activeWorkflows: number;
  failureCount: number;
  averageLatencyMs: number;
}
