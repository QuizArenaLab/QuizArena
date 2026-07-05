import { MetricPoint } from '../engines/MetricsEngine';
import { PlatformHealthReport } from '../engines/PlatformHealthMonitor';
import { SagaInstance } from '../orchestration/SagaCoordinator';
import { DeadLetterEntry } from '../resiliency/DeadLetterQueue';

export interface PlatformDashboardReadModel {
  health: PlatformHealthReport;
  activeSagas: SagaInstance[];
  metrics: MetricPoint[];
  dlqItems: DeadLetterEntry[];
  uptimeSeconds: number;
}
