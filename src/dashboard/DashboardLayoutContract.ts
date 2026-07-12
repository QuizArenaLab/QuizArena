import { DashboardVariant } from "./DashboardVariant";
import { DashboardSlot } from "./DashboardSlot";

export interface DashboardLayoutMetadata {
  variant: DashboardVariant;
  defaultSlots: DashboardSlot[];
  spacing: string;
  columns: number;
  compact: boolean;
  maxWidth: string;
}

export interface DashboardAccessibility {
  ariaLabels: boolean;
  keyboardNav: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}
