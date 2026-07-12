"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { WorkspacePlaceholder } from "@/components/workspace-state/WorkspacePlaceholder";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface WidgetSlotProps {
  id: string; // Usually the placement ID or a combination of zone/col/row
  children?: ReactNode; // Ideally a WidgetHost
  className?: string;
  gridArea?: string; // If using grid areas
  colSpan?: number;
  rowSpan?: number;
}

export function WidgetSlot({
  id,
  children,
  className = "",
  gridArea,
  colSpan,
  rowSpan,
}: WidgetSlotProps) {
  const { mode } = useDashboardBuilder();
  const isEmpty = !children;
  const isEditMode = mode === "EDIT";

  const style: React.CSSProperties = {
    gridArea,
    gridColumn: colSpan ? `span ${colSpan}` : undefined,
    gridRow: rowSpan ? `span ${rowSpan}` : undefined,
  };

  return (
    <div
      className={`relative w-full h-full min-h-[120px] rounded-xl transition-all duration-200 ${
        isEmpty && isEditMode ? "bg-gray-50 border-2 border-dashed border-gray-200" : ""
      } ${className}`}
      style={style}
      data-slot-id={id}
    >
      {isEmpty ? (
        <div className="absolute inset-0 p-4">
          {isEditMode && (
            <WorkspacePlaceholder
              title="Empty Slot"
              description="Click or drag a widget here"
              icon="PlusSquare"
              className="h-full border-none"
            />
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

ComponentRegistry.register({
  id: "widget-slot",
  name: "WidgetSlot",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetSlot";
