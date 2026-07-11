"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationCollapseProps } from "./NavigationCollapse.types";
import { ComponentRegistry } from "@/registry";

export const NavigationCollapse: React.FC<NavigationCollapseProps> = ({ collapsed, children }) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col overflow-hidden bg-white border-r border-gray-100 z-30"
    >
      {/* We apply a generic fade transition on the content based on collapsed state */}
      <AnimatePresence mode="wait">
        <motion.div
          key={collapsed ? "collapsed" : "expanded"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col min-w-[280px]" // Force content to think it has full width during transition to prevent text wrapping artifacts
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export const NavigationAccordionTransition: React.FC<{
  expanded: boolean;
  id: string;
  children: React.ReactNode;
}> = ({ expanded, id, children }) => {
  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          id={id}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={{
            expanded: { opacity: 1, height: "auto", marginTop: 4 },
            collapsed: { opacity: 0, height: 0, marginTop: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ComponentRegistry.register({
  id: "nav-collapse",
  name: "NavigationCollapse",
  category: "navigation",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
