import React, { ReactNode } from "react";
import { cn } from "../../../utilities";

export interface FilterBarProps {
  children?: ReactNode;
  actionSlot?: ReactNode;
  className?: string;
  isCompact?: boolean;
}

export function FilterBar({ children, actionSlot, className, isCompact }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full p-2 border border-input rounded-md bg-background",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-wrap flex-1 overflow-hidden">
        {children || (
          <span className="text-sm text-muted-foreground px-2 py-1">No active filters</span>
        )}
      </div>

      {actionSlot && (
        <div className="flex-shrink-0 ml-4 flex items-center border-l pl-4 border-input">
          {actionSlot}
        </div>
      )}
    </div>
  );
}
