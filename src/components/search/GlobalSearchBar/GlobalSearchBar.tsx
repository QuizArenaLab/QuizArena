import React, { ReactNode } from "react";
import { cn } from "../../../utilities";
import { SearchInput, SearchInputProps } from "../SearchInput";

export interface GlobalSearchBarProps extends SearchInputProps {
  actionSlot?: ReactNode;
  isCompact?: boolean;
}

export function GlobalSearchBar({
  actionSlot,
  isCompact = false,
  className,
  ...props
}: GlobalSearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full",
        isCompact ? "max-w-sm" : "max-w-3xl",
        className
      )}
    >
      <div className="flex-1">
        <SearchInput {...props} />
      </div>
      {actionSlot && <div className="flex-shrink-0">{actionSlot}</div>}
    </div>
  );
}
