import React, { ReactNode, useState } from "react";
import { cn } from "../../../utilities";
import { Icon } from "../../../icons";

export interface FilterGroupProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FilterGroup({
  title,
  description,
  children,
  defaultExpanded = true,
  disabled = false,
  className,
}: FilterGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("space-y-3", disabled && "opacity-50 pointer-events-none", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center justify-between py-2 text-sm font-medium transition-colors",
          "hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        )}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-semibold">{title}</span>
          {description && (
            <span className="text-xs font-normal text-muted-foreground">{description}</span>
          )}
        </div>
        <Icon
          name="ChevronDown"
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
            !expanded && "-rotate-90"
          )}
        />
      </button>

      {expanded && (
        <div className="animate-in slide-in-from-top-1 fade-in duration-200">{children}</div>
      )}
    </div>
  );
}
