import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { Icon } from "../../../icons";

export interface SavedFilterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  description?: string;
  icon?: ReactNode;
  favorite?: boolean;
  shared?: boolean;
  recent?: boolean;
  locked?: boolean;
}

export function SavedFilter({
  name,
  description,
  icon,
  favorite,
  shared,
  recent,
  locked,
  className,
  ...props
}: SavedFilterProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors border border-transparent",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground mt-0.5">
        {icon || <Icon name="Filter" className="h-4 w-4" />}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-none truncate">{name}</span>
          {locked && (
            <Icon
              name="Lock"
              className="h-3 w-3 text-muted-foreground shrink-0"
              aria-label="Locked filter"
            />
          )}
          {shared && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200 shrink-0">
              Shared
            </span>
          )}
          {recent && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900 dark:text-green-200 shrink-0">
              Recent
            </span>
          )}
        </div>

        {description && (
          <span className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{description}</span>
        )}
      </div>

      {favorite !== undefined && (
        <button
          type="button"
          className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={(e) => {
            e.stopPropagation();
            // In a real implementation this would dispatch an event
          }}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Icon
            name="Star"
            className={cn(
              "h-4 w-4",
              favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            )}
          />
        </button>
      )}
    </button>
  );
}
