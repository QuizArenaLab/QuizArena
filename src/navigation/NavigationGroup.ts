import { NavigationTreeNode } from "./NavigationTreeNode";
import { IconName } from "@/icons/IconRegistry";

export interface NavigationGroupConfig {
  id: string;
  title?: string;
  icon?: IconName;
  description?: string;
  expanded?: boolean;
  collapsed?: boolean;
  defaultExpanded?: boolean;
  divider?: boolean;
  order?: number;
}

export interface ResolvedNavigationGroup extends NavigationGroupConfig {
  nodes: NavigationTreeNode[];
}
