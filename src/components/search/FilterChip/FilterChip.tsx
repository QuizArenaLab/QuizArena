import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { Icon } from "../../../icons";

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  counter?: number;
  favorite?: boolean;
}

export function FilterChip({
  label,
  selected,
  disabled,
  removable,
  onRemove,
  icon,
  counter,
  favorite,
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
          : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {favorite && (
        <Icon
          name="Star"
          className={cn(
            "h-3.5 w-3.5",
            selected ? "fill-primary-foreground" : "fill-muted-foreground"
          )}
        />
      )}

      {icon && <span className="flex-shrink-0">{icon}</span>}

      <span>{label}</span>

      {counter !== undefined && (
        <span
          className={cn(
            "ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
            selected ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
          )}
        >
          {counter}
        </span>
      )}

      {removable && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label} filter`}
          className={cn(
            "ml-1 -mr-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }
          }}
        >
          <Icon name="X" className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
