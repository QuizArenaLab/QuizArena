import { NavigationBadge } from "@/navigation";

export interface NavigationItemProps {
  id: string;
  title: string;
  route: string;
  icon?: string;
  activeIcon?: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  badge?: NavigationBadge;
  favorite?: boolean;
  recent?: boolean;
  hasChildren?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
