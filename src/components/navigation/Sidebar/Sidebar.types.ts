import { ResolvedNavigationGroup } from "@/navigation/NavigationGroup";
import React from "react";

export interface SidebarProps {
  groups: ResolvedNavigationGroup[];
  headerNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  currentRoute?: string;
  className?: string;
}
