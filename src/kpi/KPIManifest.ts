import { KPICapabilities } from "./KPICapabilities";
import { KPIVariant } from "./KPIVariant";
import { KPISize } from "./KPISize";
import { KPIStatus } from "./KPIStatus";

export interface KPIMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  version: string;
  registryVersion: string;
  status: "draft" | "active" | "deprecated" | "archived";
}

export interface KPIPresentationMetadata {
  variant: KPIVariant;
  size: KPISize;
  status: KPIStatus;
  compact: boolean;
}

export interface KPIAccessibility {
  ariaLabels: boolean;
  keyboardNav: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface KPIManifest {
  metadata: KPIMetadata;
  capabilities: KPICapabilities;
  presentation: KPIPresentationMetadata;
  accessibility: KPIAccessibility;
}
