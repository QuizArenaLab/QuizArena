"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  showRequirements?: boolean;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, hint, showRequirements, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;

    const requirements = [
      { met: (props.value as string)?.length >= 8, text: "8+ characters" },
      { met: /[A-Z]/.test((props.value as string) || ""), text: "uppercase letter" },
      { met: /[0-9]/.test((props.value as string) || ""), text: "number" },
    ];

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-slate-700 tracking-tight">
            {label}
            {props.required && <span className="ml-1 text-primary">*</span>}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={clsx(
              "flex w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm transition-all duration-200 outline-none",
              "placeholder:text-slate-400 placeholder:font-normal",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
              error
                ? "border-red-200 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 text-slate-900 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : showRequirements ? `${inputId}-requirements` : undefined
            }
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={props.disabled ? -1 : 0}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" strokeWidth={2} />
            ) : (
              <Eye className="h-4.5 w-4.5" strokeWidth={2} />
            )}
          </button>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[12px] text-red-500 font-medium flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1"
            role="alert"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </p>
        )}
        {showRequirements && !error && (props.value as string)?.length > 0 && (
          <div id={`${inputId}-requirements`} className="flex flex-wrap gap-x-3 gap-y-1.5 px-1 mt-2">
            {requirements.map((req, i) => (
              <span
                key={i}
                className={clsx(
                  "text-[11px] font-medium flex items-center gap-1.5 transition-colors",
                  req.met ? "text-green-600" : "text-slate-400"
                )}
              >
                <span
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    req.met ? "bg-green-500 scale-110 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-200"
                  )}
                />
                {req.text}
              </span>
            ))}
          </div>
        )}
        {hint && !error && !showRequirements && (
          <p id={`${inputId}-hint`} className="text-[12px] text-slate-400 px-1">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
