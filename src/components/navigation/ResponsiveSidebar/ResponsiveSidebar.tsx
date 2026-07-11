"use client";

import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { useNavigationCollapse } from "@/providers/NavigationProvider";
import { ResponsiveBreakpoint } from "@/layouts/workspace/ResponsiveBreakpoint";
import { Sidebar } from "../Sidebar";
import { ResponsiveSidebarProps } from "./ResponsiveSidebar.types";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/icons/Icon";
import { NavigationEventBus } from "@/navigation";

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  groups,
  headerNode,
  footerNode,
  mobileHeaderNode,
  currentRoute,
  className = "",
  direction = "LTR",
}) => {
  const { responsive } = useWorkspace();
  const { collapsed, setCollapsed } = useNavigationCollapse();

  // Handle breakpoint-driven default states
  useEffect(() => {
    if (responsive === ResponsiveBreakpoint.Laptop) {
      setCollapsed(true);
      NavigationEventBus.dispatch("SidebarCollapsed", { trigger: "responsive" });
    } else if (responsive === ResponsiveBreakpoint.Desktop) {
      setCollapsed(false);
      NavigationEventBus.dispatch("SidebarExpanded", { trigger: "responsive" });
    }
  }, [responsive, setCollapsed]);

  const isMobileOrTablet =
    responsive === ResponsiveBreakpoint.Mobile ||
    responsive === ResponsiveBreakpoint.SmallMobile ||
    responsive === ResponsiveBreakpoint.Tablet;

  if (isMobileOrTablet) {
    // In mobile/tablet, if collapsed is false, it means the drawer is open.
    // If true, it's closed.
    return (
      <AnimatePresence>
        {!collapsed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-40"
              onClick={() => setCollapsed(true)}
            />
            <motion.div
              initial={{ x: direction === "RTL" ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: direction === "RTL" ? 280 : -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col ${className}`}
            >
              {mobileHeaderNode || headerNode}

              <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                {/* We force uncollapsed state for the tree inside the mobile drawer */}
                <div className="hidden">
                  {/* Dummy block to satisfy strict React conditions if needed */}
                </div>
                {/* Render Sidebar content directly but we don't want the NavigationCollapse wrapper's width transition here. 
                    Actually we can just render Sidebar and force it not to collapse by temporarily overriding context or passing a prop.
                    Wait, our Sidebar uses `useNavigationState`. In mobile, `collapsed` means drawer closed.
                    So if we are here, `collapsed` is false. Thus Sidebar will render expanded.
                */}
                <Sidebar
                  groups={groups}
                  currentRoute={currentRoute}
                  // No header/footer here because we are placing them outside or we can pass them in
                />
              </nav>

              {footerNode}

              {/* Close button for mobile */}
              <button
                onClick={() => setCollapsed(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-navy"
                aria-label="Close navigation"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop / Laptop
  return (
    <Sidebar
      groups={groups}
      headerNode={headerNode}
      footerNode={footerNode}
      currentRoute={currentRoute}
      className={className}
    />
  );
};

ComponentRegistry.register({
  id: "nav-responsive-sidebar",
  name: "ResponsiveSidebar",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
