"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProviderRegistry } from "@/registry";
import { DashboardBuilderMode } from "@/dashboard-builder/types";

export interface DashboardBuilderContextValue {
  mode: DashboardBuilderMode;
  setMode: (mode: DashboardBuilderMode) => void;

  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;

  responsiveMode: "mobile" | "tablet" | "desktop";
  setResponsiveMode: (mode: "mobile" | "tablet" | "desktop") => void;

  selectedWidgetId: string | null;
  setSelectedWidgetId: (id: string | null) => void;

  hoveredWidgetId: string | null;
  setHoveredWidgetId: (id: string | null) => void;
}

const DashboardBuilderContext = createContext<DashboardBuilderContextValue | undefined>(undefined);

export function DashboardBuilderProvider({
  children,
  defaultMode = "VIEW",
  defaultCompact = false,
  defaultResponsive = "desktop",
}: {
  children: ReactNode;
  defaultMode?: DashboardBuilderMode;
  defaultCompact?: boolean;
  defaultResponsive?: "mobile" | "tablet" | "desktop";
}) {
  const [mode, setMode] = useState<DashboardBuilderMode>(defaultMode);
  const [compactMode, setCompactMode] = useState<boolean>(defaultCompact);
  const [responsiveMode, setResponsiveMode] = useState<"mobile" | "tablet" | "desktop">(
    defaultResponsive
  );
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [hoveredWidgetId, setHoveredWidgetId] = useState<string | null>(null);

  return (
    <DashboardBuilderContext.Provider
      value={{
        mode,
        setMode,
        compactMode,
        setCompactMode,
        responsiveMode,
        setResponsiveMode,
        selectedWidgetId,
        setSelectedWidgetId,
        hoveredWidgetId,
        setHoveredWidgetId,
      }}
    >
      {children}
    </DashboardBuilderContext.Provider>
  );
}

export function useDashboardBuilder() {
  const context = useContext(DashboardBuilderContext);
  if (!context) {
    throw new Error("useDashboardBuilder must be used within a DashboardBuilderProvider");
  }
  return context;
}

ProviderRegistry.register({
  id: "dashboard-builder-provider",
  name: "DashboardBuilderProvider",
  description: "Provides presentation state for the Enterprise Dashboard Builder Platform",
});
