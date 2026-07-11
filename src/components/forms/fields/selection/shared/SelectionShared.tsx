import React, { ReactNode } from "react";
import { cn } from "@/utilities";

export function SelectionMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col w-full", className)}>{children}</div>;
}

export function SelectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold border-b", className)}>{children}</div>
  );
}

export function SelectionFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-2 py-1.5 text-sm border-t", className)}>{children}</div>;
}

export function SelectionSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-2 py-2 border-b sticky top-0 bg-popover z-10", className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

export function SelectionViewport({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-h-60 overflow-y-auto overflow-x-hidden p-1", className)}>
      {children}
    </div>
  );
}

export function SelectionOption({
  children,
  selected,
  onSelect,
  disabled,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      role="option"
      aria-selected={selected}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => {
        if (!disabled && onSelect) onSelect();
      }}
    >
      {selected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-primary">
          ✓
        </span>
      )}
      {children}
    </div>
  );
}

export function SelectionEmpty({
  children = "No results found.",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-6 text-center text-sm text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function SelectionLoading({
  children = "Loading...",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-6 text-center text-sm text-muted-foreground animate-pulse", className)}>
      {children}
    </div>
  );
}

export function SelectionChip({
  children,
  onRemove,
  disabled,
  className,
}: {
  children: ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "bg-secondary text-secondary-foreground",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove();
          }}
          className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      )}
    </span>
  );
}

export function SelectionBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground",
        className
      )}
    >
      {count}
    </span>
  );
}
