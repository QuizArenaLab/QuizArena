"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardEditOverlayProps {
  className?: string;
}

export function DashboardEditOverlay({ className = "" }: DashboardEditOverlayProps) {
  const { mode } = useDashboardBuilder();

  if (mode !== "EDIT") return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 ${className}`}
    />
  );
}

ComponentRegistry.register({
  id: "dashboard-edit-overlay",
  name: "DashboardEditOverlay",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardEditOverlay";
