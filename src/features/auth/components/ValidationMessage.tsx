"use client";

import clsx from "clsx";

interface ValidationMessageProps {
  type: "error" | "success" | "info";
  message: string;
  className?: string;
}

export default function ValidationMessage({ type, message, className }: ValidationMessageProps) {
  const styles = {
    error: "bg-red-50/80 text-red-700/90 border border-red-200/50",
    success: "bg-green-50/80 text-green-700/90 border border-green-200/50",
    info: "bg-accent/20 text-navy/80 border border-accent/40",
  };

  const icons = {
    error: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm",
        styles[type],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}
