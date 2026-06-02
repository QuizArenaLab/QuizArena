"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";
import type { SovereignAlert } from "@/types/super-admin-dashboard";

export function FinancialAlertBanner({ alerts }: { alerts: SovereignAlert[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.severity === "CRITICAL" || alert.severity === "EMERGENCY";
        const isWarning = alert.severity === "WARNING";

        return (
          <div
            key={alert.id}
            className={`flex items-start p-4 rounded-xl border ${
              isCritical
                ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-800 dark:text-rose-300"
                : isWarning
                  ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-300"
                  : "bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isCritical ? (
                <XCircle className="w-5 h-5" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold tracking-tight">{alert.title}</h3>
              <div className="mt-1 text-sm opacity-90">{alert.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
