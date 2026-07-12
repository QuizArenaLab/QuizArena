import { DashboardGridDefinition } from "./DashboardGridDefinition";
import { DashboardZoneDefinition } from "./DashboardZoneDefinition";

export interface DashboardLayoutDefinition {
  id: string;
  grid: DashboardGridDefinition;
  zones: DashboardZoneDefinition[];
}
