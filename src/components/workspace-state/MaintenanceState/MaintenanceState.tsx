"use client";

import React from "react";
import { MaintenanceStateProps } from "./MaintenanceState.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";
import { IconName } from "@/icons/IconRegistry";

export function MaintenanceState({
  variant = "scheduled",
  title,
  description,
  action,
  className = "",
}: MaintenanceStateProps) {
  const { compactMode, fullscreen } = useWorkspaceState();

  let defaultIcon: IconName = "Wrench";
  let defaultTitle = "Scheduled Maintenance";
  let defaultDescription =
    "We are currently undergoing scheduled maintenance. Please check back later.";

  switch (variant) {
    case "temporary":
      defaultIcon = "AlertTriangle";
      defaultTitle = "Temporarily Unavailable";
      defaultDescription = "This service is temporarily down. Our team is working to restore it.";
      break;
    case "read-only":
      defaultIcon = "Database";
      defaultTitle = "Maintenance Mode";
      defaultDescription = "The system is in maintenance mode. Some features are read-only.";
      break;
    case "upgrade":
      defaultIcon = "ArrowUpCircle";
      defaultTitle = "System Upgrade";
      defaultDescription = "We are upgrading our systems to serve you better.";
      break;
    default:
      break;
  }

  const finalIcon = defaultIcon;
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  const sizeStyles = compactMode ? "p-6" : fullscreen ? "p-24" : "p-12";
  const iconSizeStyles = compactMode ? "w-12 h-12" : fullscreen ? "w-24 h-24" : "w-16 h-16";
  const titleStyles = compactMode ? "text-lg mt-4" : fullscreen ? "text-3xl mt-8" : "text-xl mt-6";
  const descStyles = compactMode
    ? "text-xs mt-2 max-w-xs"
    : fullscreen
      ? "text-lg mt-4 max-w-2xl"
      : "text-sm mt-3 max-w-md";

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full text-center bg-orange-50/50 rounded-2xl border border-orange-100 ${sizeStyles} ${className}`}
      role="status"
    >
      <div
        className={`flex items-center justify-center bg-orange-100 rounded-full text-orange-500 shadow-sm ${iconSizeStyles}`}
      >
        <Icon name={finalIcon} className="w-1/2 h-1/2" />
      </div>
      <h3 className={`font-semibold text-orange-900 ${titleStyles}`}>{finalTitle}</h3>
      <p className={`text-orange-700 ${descStyles}`}>{finalDescription}</p>
      {action && <div className={`mt-6 ${fullscreen ? "mt-10" : ""}`}>{action}</div>}
    </div>
  );
}

ComponentRegistry.register({
  id: "maintenance-state",
  name: "MaintenanceState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
