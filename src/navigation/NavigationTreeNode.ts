import { NavigationManifest } from "./NavigationManifest";
import { NavigationPermission } from "./NavigationPermissions";

export interface NavigationTreeNode {
  manifest: NavigationManifest;
  children: NavigationTreeNode[];
  expanded?: boolean;
  active?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  hasAccess?: (permissions: NavigationPermission[]) => boolean;
}
