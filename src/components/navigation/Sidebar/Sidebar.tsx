"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { SidebarProps } from "./Sidebar.types";
import { NavigationTree } from "../NavigationTree";
import { NavigationCollapse } from "../NavigationCollapse";
import { useNavigationCollapse } from "@/providers/NavigationProvider";

export const Sidebar: React.FC<SidebarProps> = ({
  groups,
  headerNode,
  footerNode,
  currentRoute,
  className = "",
}) => {
  const { collapsed } = useNavigationCollapse();

  return (
    <NavigationCollapse collapsed={collapsed}>
      <aside className={`flex flex-col h-full bg-white ${className}`}>
        {headerNode && <div className="shrink-0">{headerNode}</div>}

        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4"
          aria-label="Main Navigation"
        >
          <NavigationTree groups={groups} currentRoute={currentRoute} />
        </nav>

        {footerNode && (
          <div className="shrink-0 mt-auto border-t border-gray-100 p-4">{footerNode}</div>
        )}
      </aside>
    </NavigationCollapse>
  );
};

ComponentRegistry.register({
  id: "nav-sidebar",
  name: "Sidebar",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
