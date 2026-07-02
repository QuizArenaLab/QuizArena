import { FileRecord } from '../config/architecture.types';

export enum MigrationStatus {
  READY = 'READY',
  BLOCKED = 'BLOCKED',
  MIGRATING = 'MIGRATING',
  MIGRATED = 'MIGRATED',
  VERIFIED = 'VERIFIED',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

export interface MigrationPlan {
  status: MigrationStatus;
  replacementTarget?: string;
  migrationBatch: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dependencyImpact: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  executionOrder: number;
}

export class MigrationPlanner {
  static plan(records: FileRecord[]): Map<string, MigrationPlan> {
    const plans = new Map<string, MigrationPlan>();
    
    for (const record of records) {
      const isLegacy = record.classification?.status === 'LEGACY';
      const impact = record.dependencies?.reverseDependencyCount || 0;
      
      plans.set(record.metadata.absolutePath, {
        status: isLegacy ? MigrationStatus.READY : MigrationStatus.VERIFIED,
        migrationBatch: 1,
        priority: impact > 5 ? 'HIGH' : 'MEDIUM',
        dependencyImpact: impact,
        riskLevel: impact > 10 ? 'HIGH' : 'MEDIUM',
        executionOrder: impact // Less impact, later execution (or vice versa depending on strategy)
      });
    }

    return plans;
  }
}
