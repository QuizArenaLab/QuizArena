"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardCanvasProps {
  children: ReactNode; // Expected to contain DashboardGrid
  className?: string;
}

export function DashboardCanvas({ children, className = "" }: DashboardCanvasProps) {
  const { compactMode, mode } = useDashboardBuilder();
  const isEditMode = mode === "EDIT";

  return (
    <div
      className={`w-full h-full flex flex-col ${compactMode ? "p-4 gap-4" : "p-6 md:p-8 gap-8"} ${
        isEditMode ? "bg-gray-50/50 min-h-[500px]" : "bg-transparent"
      } ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "dashboard-canvas",
  name: "DashboardCanvas",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardCanvas";
