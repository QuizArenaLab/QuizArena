import { ResolvedNavigationGroup } from "@/navigation/NavigationGroup";

export interface NavigationTreeProps {
  groups: ResolvedNavigationGroup[];
  currentRoute?: string;
  className?: string;
}
