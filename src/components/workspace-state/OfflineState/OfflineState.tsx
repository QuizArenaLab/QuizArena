"use client";

import React from "react";
import { OfflineStateProps } from "./OfflineState.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";

export function OfflineState({
  title = "You are offline",
  description = "Please check your internet connection and try again.",
  action,
  className = "",
}: OfflineStateProps) {
  const { compactMode, fullscreen } = useWorkspaceState();

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
      className={`flex flex-col items-center justify-center w-full h-full text-center bg-gray-50 rounded-2xl ${sizeStyles} ${className}`}
      role="alert"
    >
      <div
        className={`flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 shadow-sm ${iconSizeStyles}`}
      >
        <Icon name="WifiOff" className="w-1/2 h-1/2" />
      </div>
      <h3 className={`font-semibold text-navy ${titleStyles}`}>{title}</h3>
      <p className={`text-gray-500 ${descStyles}`}>{description}</p>
      {action && <div className={`mt-6 ${fullscreen ? "mt-10" : ""}`}>{action}</div>}
    </div>
  );
}

ComponentRegistry.register({
  id: "offline-state",
  name: "OfflineState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
