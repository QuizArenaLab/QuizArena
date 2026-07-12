"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";

export interface WidgetSelectionProps {
  selected?: boolean;
  hovered?: boolean;
  className?: string;
}

export function WidgetSelection({ selected, hovered, className = "" }: WidgetSelectionProps) {
  if (!selected && !hovered) return null;

  const borderClass = selected
    ? "border-2 border-primary z-10"
    : hovered
      ? "border-2 border-primary/50 border-dashed z-0"
      : "";

  return (
    <div
      className={`absolute inset-0 pointer-events-none rounded-xl transition-all ${borderClass} ${className}`}
    />
  );
}

ComponentRegistry.register({
  id: "widget-selection",
  name: "WidgetSelection",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetSelection";
