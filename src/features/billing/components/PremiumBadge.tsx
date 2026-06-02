import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PremiumBadge({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium tracking-wide",
        "bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200",
        "text-indigo-700 shadow-sm",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      <Sparkles className={cn("text-indigo-500", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      <span>Premium</span>
    </div>
  );
}
