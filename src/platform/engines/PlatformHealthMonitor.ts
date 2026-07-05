import { DomainBootContract, DomainHealthReport } from '../contracts/DomainBootContract';

export interface PlatformHealthReport {
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'FAILED';
  domains: Record<string, DomainHealthReport>;
  generatedAt: Date;
}

export class PlatformHealthMonitor {
  private domains: Map<string, DomainBootContract> = new Map();

  public registerDomain(domain: DomainBootContract): void {
    this.domains.set(domain.domainId, domain);
  }

  public async generateReport(): Promise<PlatformHealthReport> {
    const report: PlatformHealthReport = {
      overallStatus: 'HEALTHY',
      domains: {},
      generatedAt: new Date()
    };

    let hasDegraded = false;
    let hasFailed = false;

    for (const [id, domain] of this.domains.entries()) {
      try {
        const health = await domain.healthCheck();
        report.domains[id] = health;
        if (health.status === 'DEGRADED') hasDegraded = true;
        if (health.status === 'FAILED') hasFailed = true;
      } catch (err) {
        hasFailed = true;
        report.domains[id] = {
          status: 'FAILED',
          version: 'unknown',
          uptimeSeconds: 0,
          lastEventAt: null,
          pendingJobs: 0,
          activeWorkflows: 0,
          failureCount: 1,
          averageLatencyMs: 0
        };
      }
    }

    if (hasFailed) {
      report.overallStatus = 'FAILED';
    } else if (hasDegraded) {
      report.overallStatus = 'DEGRADED';
    }

    return report;
  }
}
