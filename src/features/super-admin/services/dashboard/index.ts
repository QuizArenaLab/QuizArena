import { getPlatformOverview } from "./overview";
import { getInfrastructureHealth } from "./health";
import { getSecurityOverview } from "./security";
import { getGovernanceStatus } from "./governance";
import { getOperationalAlerts } from "./alerts";
import { getStrategicInsights } from "./intelligence";
import { getActivityTimeline } from "./timeline";
import type { SovereignDashboardData } from "@/types/super-admin-dashboard";

export async function getSovereignDashboardData(): Promise<SovereignDashboardData> {
  const [overview, health, security, governance, alerts, intelligence, timeline] =
    await Promise.all([
      getPlatformOverview(),
      getInfrastructureHealth(),
      getSecurityOverview(),
      getGovernanceStatus(),
      getOperationalAlerts(),
      getStrategicInsights(),
      getActivityTimeline(),
    ]);

  return {
    overview,
    health,
    security,
    governance,
    alerts,
    intelligence,
    timeline,
    lastAggregated: new Date(),
  };
}
