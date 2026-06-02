"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "success";
  size?: "default" | "lg";
}

const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  (
    { loading, variant = "primary", size = "default", className, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={clsx(
          "group relative flex w-full items-center justify-center gap-2.5 font-semibold rounded-xl",
          "focus:outline-none focus:ring-4 focus:ring-primary/10",
          "disabled:pointer-events-none disabled:opacity-50",
          "transition-all duration-300 active:scale-[0.98] hover:-translate-y-px",
          size === "lg" ? "px-6 py-4 text-[15px]" : "px-5 py-3 text-sm",
          variant === "primary"
            ? "bg-navy text-white hover:bg-navy/95 shadow-[0_4px_12px_rgba(11,15,25,0.12)] hover:shadow-[0_6px_20px_rgba(11,15,25,0.18)]"
            : variant === "success"
              ? "bg-green-600 text-white hover:bg-green-700 shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.3)]"
              : "bg-primary text-white hover:bg-primary-dark shadow-[0_4px_12px_rgba(37,113,231,0.2)] hover:shadow-[0_6px_20px_rgba(37,113,231,0.3)]",
          loading && "opacity-90 pointer-events-none",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={2.5} />}
        <span className={loading ? "opacity-0" : "flex items-center gap-2"}>
          {children}
          {!loading && (
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 transition-all group-hover:bg-white/40" />
          )}
        </span>
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";

export default AuthButton;
