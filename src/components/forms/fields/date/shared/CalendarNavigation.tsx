import React from "react";

export interface CalendarNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
}

export function CalendarNavigation({
  onPreviousClick,
  onNextClick,
  previousDisabled,
  nextDisabled,
  className = "",
  ...props
}: CalendarNavigationProps) {
  return (
    <div className={`flex space-x-1 ${className}`} {...props}>
      <button
        type="button"
        onClick={onPreviousClick}
        disabled={previousDisabled}
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md"
        aria-label="Go to previous"
      >
        <span>&larr;</span>
      </button>
      <button
        type="button"
        onClick={onNextClick}
        disabled={nextDisabled}
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md"
        aria-label="Go to next"
      >
        <span>&rarr;</span>
      </button>
    </div>
  );
}
