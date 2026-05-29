"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  isSuccess?: boolean;
  tooltip?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, hint, isSuccess, tooltip, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={inputId}
              className="block text-[13px] font-semibold text-slate-700 tracking-tight"
            >
              {label}
              {props.required && <span className="ml-1 text-primary">*</span>}
            </label>
            {tooltip && (
              <div className="group/tooltip relative flex items-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-help"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block w-max max-w-[200px] bg-slate-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded shadow-lg z-10 text-center leading-tight">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="relative group">
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "flex w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-150 outline-none",
              "placeholder:text-slate-400 placeholder:font-normal",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
              error
                ? "border-red-200 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:shadow-md"
                : isSuccess
                  ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/10 text-slate-900 shadow-sm focus:shadow-md"
                  : "border-slate-200 text-slate-900 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm focus:shadow-md",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[12px] text-red-500 font-medium flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1"
            role="alert"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-[12px] text-slate-400 px-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
