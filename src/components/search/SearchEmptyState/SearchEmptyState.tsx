import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { Icon, IconName } from "../../../icons";
import { SearchEmptyStateType } from "../../../search";

export interface SearchEmptyStateProps {
  type: SearchEmptyStateType;
  title?: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
}

export function SearchEmptyState({
  type,
  title,
  description,
  icon,
  action,
  className,
}: SearchEmptyStateProps) {
  const getDefaults = (): { defaultIcon: IconName; defaultTitle: string; defaultDesc: string } => {
    switch (type) {
      case "No Search Yet":
        return {
          defaultIcon: "Search",
          defaultTitle: "Ready to search",
          defaultDesc: "Enter a search term to find what you are looking for.",
        };
      case "No Results":
        return {
          defaultIcon: "FileSearch",
          defaultTitle: "No results found",
          defaultDesc: "Try adjusting your search or filters to find what you are looking for.",
        };
      case "Loading":
        return {
          defaultIcon: "Loader2",
          defaultTitle: "Searching...",
          defaultDesc: "Please wait while we fetch the results.",
        };
      case "Offline":
        return {
          defaultIcon: "WifiOff",
          defaultTitle: "You are offline",
          defaultDesc: "Please check your internet connection and try again.",
        };
      case "Permission Restricted":
        return {
          defaultIcon: "Lock",
          defaultTitle: "Access Denied",
          defaultDesc: "You do not have permission to view these search results.",
        };
      default:
        return {
          defaultIcon: "Search",
          defaultTitle: "Search",
          defaultDesc: "",
        };
    }
  };

  const { defaultIcon, defaultTitle, defaultDesc } = getDefaults();

  const isSpinning = type === "Loading" && !icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-4">
        <Icon name={icon || defaultIcon} className={cn("h-8 w-8", isSpinning && "animate-spin")} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title || defaultTitle}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description || defaultDesc}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
