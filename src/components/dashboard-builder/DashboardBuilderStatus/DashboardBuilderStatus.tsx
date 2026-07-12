"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardBuilderStatusProps {
  className?: string;
}

export function DashboardBuilderStatus({ className = "" }: DashboardBuilderStatusProps) {
  const { mode } = useDashboardBuilder();

  if (mode === "VIEW") return null;

  const getStatusText = () => {
    switch (mode) {
      case "EDIT":
        return "Editing Layout (Unsaved)";
      case "PREVIEW":
        return "Preview Mode";
      case "LOCKED":
        return "Layout Locked";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (mode) {
      case "EDIT":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "PREVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LOCKED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
}

ComponentRegistry.register({
  id: "dashboard-builder-status",
  name: "DashboardBuilderStatus",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardBuilderStatus";
