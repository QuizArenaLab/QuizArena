"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { ToolbarGroup } from "@/components/toolbar/ToolbarGroup";
import { ToolbarAction } from "@/components/toolbar/ToolbarAction";
import { DashboardBuilderStatus } from "../DashboardBuilderStatus/DashboardBuilderStatus";

export interface DashboardBuilderToolbarProps {
  onSave?: () => void;
  onCancel?: () => void;
  onAddWidget?: () => void;
  className?: string;
}

export function DashboardBuilderToolbar({
  onSave,
  onCancel,
  onAddWidget,
  className = "",
}: DashboardBuilderToolbarProps) {
  const { mode, setMode } = useDashboardBuilder();

  // If we are in VIEW mode, maybe we don't show the builder toolbar, or we show an "Edit Layout" button.
  // For this platform, let's always show it, but change content based on mode.

  return (
    <Toolbar className={className}>
      <div className="flex items-center gap-4 flex-1">
        <ToolbarGroup id="status-group">
          <DashboardBuilderStatus />
        </ToolbarGroup>
      </div>

      <div className="flex items-center gap-2">
        {mode === "VIEW" && (
          <ToolbarGroup id="view-actions">
            <ToolbarAction
              id="edit-layout"
              label="Edit Layout"
              icon="Edit3"
              onClick={() => setMode("EDIT")}
            />
          </ToolbarGroup>
        )}
        
        {mode === "EDIT" && (
          <ToolbarGroup id="edit-actions">
            <ToolbarAction
              id="add-widget"
              label="Add Widget"
              icon="Plus"
              onClick={onAddWidget}
            />
            <ToolbarAction
              id="cancel-edit"
              label="Cancel"
              onClick={() => {
                onCancel?.();
                setMode("VIEW");
              }}
            />
            <ToolbarAction
              id="save-layout"
              label="Save Layout"
              active
              onClick={() => {
                onSave?.();
                setMode("VIEW");
              }}
            />
          </ToolbarGroup>
        )}

        {mode === "LOCKED" && (
          <ToolbarGroup id="locked-actions">
            <ToolbarAction
              id="locked"
              label="Locked"
              icon="Lock"
              disabled
            />
          </ToolbarGroup>
        )}
      </div>
    </Toolbar>
  );
}

ComponentRegistry.register({
  id: "dashboard-builder-toolbar",
  name: "DashboardBuilderToolbar",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardBuilderToolbar";
