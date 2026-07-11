"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ProviderRegistry } from "@/registry";
import { NavigationEventBus } from "@/navigation/NavigationEvents";

// --- Tree State Context (Expansion) ---
interface NavigationTreeContextType {
  expandedGroups: string[];
  setExpandedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  toggleGroup: (groupId: string) => void;
}
const NavigationTreeContext = createContext<NavigationTreeContextType | undefined>(undefined);

// --- Selection State Context ---
interface NavigationSelectionContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}
const NavigationSelectionContext = createContext<NavigationSelectionContextType | undefined>(
  undefined
);

// --- Collapse State Context ---
interface NavigationCollapseContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapse: () => void;
}
const NavigationCollapseContext = createContext<NavigationCollapseContextType | undefined>(
  undefined
);

// --- Hover State Context ---
interface NavigationHoverContextType {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}
const NavigationHoverContext = createContext<NavigationHoverContextType | undefined>(undefined);

// --- Provider ---
export function NavigationProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const isExpanded = prev.includes(groupId);
      if (isExpanded) {
        NavigationEventBus.dispatch("GroupCollapsed", { id: groupId });
        return prev.filter((id) => id !== groupId);
      } else {
        NavigationEventBus.dispatch("GroupExpanded", { id: groupId });
        return [...prev, groupId];
      }
    });
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const newState = !prev;
      if (newState) {
        NavigationEventBus.dispatch("SidebarCollapsed", { trigger: "user" });
      } else {
        NavigationEventBus.dispatch("SidebarExpanded", { trigger: "user" });
      }
      return newState;
    });
  }, []);

  const treeValue = useMemo(
    () => ({ expandedGroups, setExpandedGroups, toggleGroup }),
    [expandedGroups, toggleGroup]
  );
  const selectionValue = useMemo(() => ({ selectedId, setSelectedId }), [selectedId]);
  const collapseValue = useMemo(
    () => ({ collapsed, setCollapsed, toggleCollapse }),
    [collapsed, toggleCollapse]
  );
  const hoverValue = useMemo(() => ({ hoveredId, setHoveredId }), [hoveredId]);

  return (
    <NavigationTreeContext.Provider value={treeValue}>
      <NavigationSelectionContext.Provider value={selectionValue}>
        <NavigationCollapseContext.Provider value={collapseValue}>
          <NavigationHoverContext.Provider value={hoverValue}>
            {children}
          </NavigationHoverContext.Provider>
        </NavigationCollapseContext.Provider>
      </NavigationSelectionContext.Provider>
    </NavigationTreeContext.Provider>
  );
}

// --- Hooks ---
export function useNavigationTree() {
  const context = useContext(NavigationTreeContext);
  if (!context) throw new Error("useNavigationTree must be used within NavigationProvider");
  return context;
}

export function useNavigationSelection() {
  const context = useContext(NavigationSelectionContext);
  if (!context) throw new Error("useNavigationSelection must be used within NavigationProvider");
  return context;
}

export function useNavigationCollapse() {
  const context = useContext(NavigationCollapseContext);
  if (!context) throw new Error("useNavigationCollapse must be used within NavigationProvider");
  return context;
}

export function useNavigationHover() {
  const context = useContext(NavigationHoverContext);
  if (!context) throw new Error("useNavigationHover must be used within NavigationProvider");
  return context;
}

ProviderRegistry.register({
  id: "navigation-provider",
  name: "NavigationProvider",
  description: "Provides granular context state for the Navigation platform",
});
