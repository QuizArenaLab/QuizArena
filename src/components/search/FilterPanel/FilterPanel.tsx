import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { PopoverRoot, PopoverTrigger, PopoverContent } from "../../primitives/Popover";

export interface FilterPanelProps {
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function FilterPanel({
  trigger,
  children,
  footer,
  open,
  onOpenChange,
  className,
}: FilterPanelProps) {
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn("w-80 p-0 flex flex-col", className)}
        role="dialog"
        aria-label="Filters"
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t bg-muted/50 rounded-b-md">
            {footer}
          </div>
        )}
      </PopoverContent>
    </PopoverRoot>
  );
}
