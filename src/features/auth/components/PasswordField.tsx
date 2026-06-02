"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  showRequirements?: boolean;
  isSuccess?: boolean;
  tooltip?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, hint, showRequirements, isSuccess, tooltip, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || props.name;

    const charRequirements = [
      { met: /[a-z]/.test((props.value as string) || ""), text: "Lower" },
      { met: /[A-Z]/.test((props.value as string) || ""), text: "Upper" },
      { met: /[0-9]/.test((props.value as string) || ""), text: "Number" },
      {
        met: /[!@#$%^&*(),.?":{}|<>]/.test((props.value as string) || ""),
        text: "Special",
      },
    ];

    const charScore = charRequirements.filter((r) => r.met).length;
    const lengthMet = (props.value as string)?.length >= 8;

    const strengthScore = charScore + (lengthMet ? 1 : 0);

    let strengthLabel = "Strength";
    let strengthColor = "bg-slate-200";
    let strengthTextColor = "text-slate-400";
    let filledBars = 0;

    if (strengthScore === 5) {
      strengthLabel = "Strong";
      strengthColor = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
      strengthTextColor = "text-green-600";
      filledBars = 4;
    } else if (strengthScore >= 3) {
      strengthLabel = "Medium";
      strengthColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      strengthTextColor = "text-amber-600";
      filledBars = strengthScore === 4 ? 3 : 2;
    } else if (strengthScore > 0) {
      strengthLabel = "Weak";
      strengthColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
      strengthTextColor = "text-red-500";
      filledBars = 1;
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const shouldShowRequirements = showRequirements && (isFocused || !!props.value || !!error);

    const isFullyValid = isSuccess || strengthScore === 5;

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
            type={showPassword ? "text" : "password"}
            className={clsx(
              "flex w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm transition-all duration-300 outline-none",
              "placeholder:text-slate-400 placeholder:font-normal",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
              error
                ? "border-red-200 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:shadow-md"
                : isFullyValid
                  ? "border-green-500/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 text-slate-900 shadow-sm focus:shadow-md"
                  : "border-slate-200 text-slate-900 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm focus:shadow-md",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : shouldShowRequirements
                  ? `${inputId}-requirements`
                  : undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-600 opacity-50 hover:opacity-100 transition-opacity duration-150"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={props.disabled ? -1 : 0}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={showPassword ? "hide" : "show"}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" strokeWidth={2} />
                ) : (
                  <Eye className="h-4.5 w-4.5" strokeWidth={2} />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
        {shouldShowRequirements && (
          <div id={`${inputId}-requirements`} className="flex flex-col gap-3 px-1 mt-3">
            {/* 4-Segment Strength Bar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-1 max-w-[150px]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "h-1.5 flex-1 rounded-full transition-all duration-500 ease-out",
                      filledBars > i ? strengthColor : "bg-slate-200"
                    )}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
              <span
                className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider transition-colors",
                  strengthTextColor
                )}
              >
                {strengthLabel}
              </span>
            </div>

            {/* Real-time Requirement Suggestions */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
              {[...charRequirements, { met: lengthMet, text: "Min 8 Chars" }].map((req) => (
                <div
                  key={req.text}
                  className={clsx(
                    "flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-300",
                    req.met ? "text-green-600" : error ? "text-red-500" : "text-slate-400"
                  )}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: req.met ? 1.15 : 0.85,
                      backgroundColor: req.met
                        ? "rgba(34,197,94,0.15)"
                        : error
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(226,232,240,1)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center justify-center shrink-0 w-3.5 h-3.5 rounded-full"
                  >
                    <motion.svg
                      initial={false}
                      animate={{ opacity: req.met ? 1 : 0, scale: req.met ? 1 : 0.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: req.met ? 0.05 : 0,
                      }}
                      className="w-2.5 h-2.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  {req.text}
                </div>
              ))}
            </div>
          </div>
        )}
        {hint && !shouldShowRequirements && (
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
