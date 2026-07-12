"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardZoneProps {
  id: string;
  name?: string;
  children: ReactNode;
  className?: string;
  direction?: "row" | "column";
  flexWrap?: boolean;
}

export function DashboardZone({
  id,
  name,
  children,
  className = "",
  direction = "row",
  flexWrap = true,
}: DashboardZoneProps) {
  const { mode } = useDashboardBuilder();
  const isEditMode = mode === "EDIT";

  const flexClasses =
    direction === "row"
      ? `flex flex-row ${flexWrap ? "flex-wrap" : ""}`
      : `flex flex-col ${flexWrap ? "flex-wrap" : ""}`;

  return (
    <div
      className={`relative w-full gap-4 ${flexClasses} ${
        isEditMode ? "p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50/50" : ""
      } ${className}`}
      data-zone-id={id}
    >
      {isEditMode && name && (
        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 rounded-full shadow-sm z-10">
          {name}
        </div>
      )}
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "dashboard-zone",
  name: "DashboardZone",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardZone";
