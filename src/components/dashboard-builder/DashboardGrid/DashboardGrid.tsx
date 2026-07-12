"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { DashboardGridDefinition } from "@/dashboard-builder/types";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardGridProps {
  gridDefinition: DashboardGridDefinition;
  children: ReactNode; // Typically DashboardZones and WidgetSlots
  className?: string;
}

export function DashboardGrid({ gridDefinition, children, className = "" }: DashboardGridProps) {
  const { responsiveMode, mode } = useDashboardBuilder();
  const isEditMode = mode === "EDIT";

  // Determine active columns based on provider's responsive mode and definition
  const columns = gridDefinition.breakpoints[responsiveMode] || gridDefinition.columns;

  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: `${gridDefinition.gap}px`,
    gridAutoRows: gridDefinition.rowHeight === "auto" ? "auto" : `${gridDefinition.rowHeight}px`,
  };

  return (
    <div 
      className={`w-full ${isEditMode ? "p-4 bg-white border border-gray-200 rounded-xl shadow-sm" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "dashboard-grid",
  name: "DashboardGrid",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardGrid";
