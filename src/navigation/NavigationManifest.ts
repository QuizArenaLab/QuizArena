import { IconName } from "@/icons/IconRegistry";
import { NavigationPermission } from "./NavigationPermissions";

export interface NavigationBadge {
  count?: number;
  label?: string;
  status?: "default" | "success" | "warning" | "error" | "info";
  color?: string; // Hex or theme color variable fallback
}

export interface NavigationManifest {
  id: string;
  title: string;
  icon?: IconName;
  activeIcon?: IconName;
  route: string;
  group?: string;
  parent?: string;
  order?: number;
  permissions?: NavigationPermission[];
  badge?: NavigationBadge;
  hidden?: boolean;
  collapsible?: boolean;
  responsive?: boolean;
  version: string;
  registryVersion: string;
  featureFlag?: string;
  status?: "stable" | "beta" | "deprecated";
}
