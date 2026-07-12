"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { DashboardLayoutDefinition } from "@/dashboard-builder/types";
import { DashboardCanvas } from "../DashboardCanvas/DashboardCanvas";
import { DashboardGrid } from "../DashboardGrid/DashboardGrid";
import { DashboardEditOverlay } from "../DashboardEditOverlay/DashboardEditOverlay";

export interface DashboardBuilderProps {
  layout: DashboardLayoutDefinition;
  children: ReactNode; // Zones and Slots
  className?: string;
}

export function DashboardBuilder({ layout, children, className = "" }: DashboardBuilderProps) {
  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      <DashboardEditOverlay />
      <DashboardCanvas>
        <DashboardGrid gridDefinition={layout.grid}>{children}</DashboardGrid>
      </DashboardCanvas>
    </div>
  );
}

ComponentRegistry.register({
  id: "dashboard-builder",
  name: "DashboardBuilder",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardBuilder";
