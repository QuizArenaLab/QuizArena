"use client";

import React from "react";
import { EmptyStateProps } from "./EmptyState.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";
import { IconName } from "@/icons/IconRegistry";

export function EmptyState({
  variant = "no-data",
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  const { compactMode, fullscreen } = useWorkspaceState();

  let defaultIcon: IconName = "Database";
  let defaultTitle = "No data available";
  let defaultDescription = "There is currently no data to display.";

  switch (variant) {
    case "no-results":
      defaultIcon = "SearchX";
      defaultTitle = "No results found";
      defaultDescription = "We couldn't find anything matching your criteria.";
      break;
    case "first-time":
      defaultIcon = "Sparkles";
      defaultTitle = "Welcome to QuizArena";
      defaultDescription = "Let's get started by creating your first item.";
      break;
    case "search-empty":
      defaultIcon = "Search";
      defaultTitle = "Search for something";
      defaultDescription = "Enter a search term to find what you're looking for.";
      break;
    case "filter-empty":
      defaultIcon = "FilterX";
      defaultTitle = "No items match your filters";
      defaultDescription = "Try adjusting your filters to see more results.";
      break;
    case "workspace-empty":
      defaultIcon = "LayoutGrid";
      defaultTitle = "This workspace is empty";
      defaultDescription = "There are no components configured for this workspace yet.";
      break;
    case "coming-soon":
      defaultIcon = "Clock";
      defaultTitle = "Coming Soon";
      defaultDescription = "This feature is currently under development.";
      break;
    case "archived":
      defaultIcon = "Archive";
      defaultTitle = "Archived Content";
      defaultDescription = "This content has been archived and is no longer active.";
      break;
    default:
      break;
  }

  const finalIcon = icon || defaultIcon;
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
      className={`flex flex-col items-center justify-center w-full h-full text-center bg-transparent rounded-2xl ${sizeStyles} ${className}`}
      role="status"
      aria-label="Empty state"
    >
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-full text-gray-500 shadow-sm ${iconSizeStyles}`}
      >
        <Icon name={finalIcon} className="w-1/2 h-1/2" />
      </div>
      <h3 className={`font-semibold text-navy ${titleStyles}`}>{finalTitle}</h3>
      <p className={`text-gray-500 ${descStyles}`}>{finalDescription}</p>
      {action && <div className={`mt-6 ${fullscreen ? "mt-10" : ""}`}>{action}</div>}
    </div>
  );
}

ComponentRegistry.register({
  id: "empty-state",
  name: "EmptyState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
