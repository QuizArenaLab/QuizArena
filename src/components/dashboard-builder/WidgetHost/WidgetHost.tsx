"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";
import { WidgetSelection } from "../WidgetSelection/WidgetSelection";
import { WidgetMovePlaceholder } from "../WidgetMovePlaceholder/WidgetMovePlaceholder";
import { WidgetResizePlaceholder } from "../WidgetResizePlaceholder/WidgetResizePlaceholder";
import { WidgetReorderPlaceholder } from "../WidgetReorderPlaceholder/WidgetReorderPlaceholder";

export interface WidgetHostProps {
  id: string; // Placement ID
  children: ReactNode; // The actual Widget
  className?: string;
  onMoveStart?: () => void;
  onResizeStart?: (direction: "se" | "sw" | "ne" | "nw") => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onClick?: () => void;
}

export function WidgetHost({
  id,
  children,
  className = "",
  onMoveStart,
  onResizeStart,
  onMoveUp,
  onMoveDown,
  onClick,
}: WidgetHostProps) {
  const { mode, selectedWidgetId, hoveredWidgetId, setHoveredWidgetId } = useDashboardBuilder();
  const isEditMode = mode === "EDIT";
  const isSelected = selectedWidgetId === id;
  const isHovered = hoveredWidgetId === id;

  return (
    <div
      className={`relative w-full h-full ${isEditMode ? "cursor-pointer" : ""} ${className}`}
      onClick={(e) => {
        if (isEditMode) {
          e.stopPropagation();
          onClick?.();
        }
      }}
      onMouseEnter={() => {
        if (isEditMode) setHoveredWidgetId(id);
      }}
      onMouseLeave={() => {
        if (isEditMode && hoveredWidgetId === id) setHoveredWidgetId(null);
      }}
    >
      {/* The actual Widget content */}
      <div
        className={`w-full h-full overflow-hidden ${isEditMode ? "pointer-events-none opacity-90" : ""}`}
      >
        {children}
      </div>

      {/* Edit Mode Overlays */}
      {isEditMode && (
        <>
          <WidgetSelection selected={isSelected} hovered={isHovered} />
          {isSelected && (
            <>
              <WidgetMovePlaceholder onMoveStart={onMoveStart} />
              <WidgetResizePlaceholder onResizeStart={onResizeStart} />
              <WidgetReorderPlaceholder onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
            </>
          )}
        </>
      )}
    </div>
  );
}

ComponentRegistry.register({
  id: "widget-host",
  name: "WidgetHost",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetHost";
