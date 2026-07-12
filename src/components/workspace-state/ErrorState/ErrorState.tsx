"use client";

import React from "react";
import { ErrorStateProps } from "./ErrorState.types";
import { ComponentRegistry } from "@/registry";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";
import { Icon } from "@/icons/Icon";
import { Button } from "@/components/primitives/Button";
import { IconName } from "@/icons/IconRegistry";
import { RetryPlaceholder } from "../RetryPlaceholder";
import { PermissionState } from "../PermissionState";

export function ErrorState({
  variant = "generic",
  title,
  description,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const { compactMode, fullscreen } = useWorkspaceState();

  if (variant === "permission-placeholder") {
    return <PermissionState variant="restricted" />;
  }

  let defaultIcon: IconName = "AlertTriangle";
  let defaultTitle = "Something went wrong";
  let defaultDescription = "An unexpected error occurred while loading this view.";

  switch (variant) {
    case "network":
      defaultIcon = "WifiOff";
      defaultTitle = "Network Error";
      defaultDescription =
        "We couldn't connect to the server. Please check your internet connection.";
      break;
    case "workspace":
      defaultIcon = "LayoutGrid";
      defaultTitle = "Workspace Error";
      defaultDescription = "The workspace failed to initialize properly.";
      break;
    case "unknown":
      defaultIcon = "HelpCircle";
      defaultTitle = "Unknown Error";
      defaultDescription = "An unknown error has occurred.";
      break;
    default:
      break;
  }

  const finalIcon = defaultIcon;
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  if (compactMode) {
    return (
      <RetryPlaceholder explanation={finalDescription} onRetry={onRetry} className={className} />
    );
  }

  const sizeStyles = fullscreen ? "p-24" : "p-12";
  const iconSizeStyles = fullscreen ? "w-24 h-24" : "w-16 h-16";
  const titleStyles = fullscreen ? "text-3xl mt-8" : "text-xl mt-6";
  const descStyles = fullscreen ? "text-lg mt-4 max-w-2xl" : "text-sm mt-3 max-w-md";

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full text-center bg-red-50/50 rounded-2xl ${sizeStyles} ${className}`}
      role="alert"
    >
      <div
        className={`flex items-center justify-center bg-red-100 rounded-full text-red-500 shadow-sm ${iconSizeStyles}`}
      >
        <Icon name={finalIcon} className="w-1/2 h-1/2" />
      </div>
      <h3 className={`font-semibold text-red-900 ${titleStyles}`}>{finalTitle}</h3>
      <p className={`text-red-700 ${descStyles}`}>{finalDescription}</p>
      {onRetry && (
        <div className={`mt-6 ${fullscreen ? "mt-10" : ""}`}>
          <Button
            variant="primary"
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

ComponentRegistry.register({
  id: "error-state",
  name: "ErrorState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
