import { DashboardMetadata } from "./DashboardMetadata";
import { DashboardCapabilities } from "./DashboardCapabilities";
import { DashboardLayoutMetadata, DashboardAccessibility } from "./DashboardLayoutContract";

export interface DashboardManifest {
  metadata: DashboardMetadata;
  capabilities: DashboardCapabilities;
  layout: DashboardLayoutMetadata;
  accessibility: DashboardAccessibility;
}
