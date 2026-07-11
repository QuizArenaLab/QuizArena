import React, { ReactNode } from "react";
import { SidebarProps } from "../Sidebar";

import { NavigationDirection } from "@/navigation";
import { ResolvedNavigationGroup } from "@/navigation";

export interface ResponsiveSidebarProps {
  groups: ResolvedNavigationGroup[];
  currentRoute?: string;
  headerNode?: ReactNode;
  footerNode?: ReactNode;
  mobileHeaderNode?: ReactNode;
  className?: string;
  direction?: NavigationDirection;
}
