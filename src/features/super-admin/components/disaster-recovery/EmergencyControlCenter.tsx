"use client";

import { useState } from "react";
import { AlertTriangle, Lock, ShieldAlert, Power, ShieldOff, ServerCrash } from "lucide-react";
import { FailSafeState } from "@/types/super-admin-disaster-recovery";

interface EmergencyControlCenterProps {
  currentState: FailSafeState;
  onActivateRecovery: (reason: string) => Promise<void>;
  onActivateLockdown: (reason: string) => Promise<void>;
  onDeactivateLockdown: (reason: string) => Promise<void>;
}

export function EmergencyControlCenter({
  currentState,
  onActivateRecovery,
  onActivateLockdown,
  onDeactivateLockdown,
}: EmergencyControlCenterProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLockdown, setConfirmLockdown] = useState(false);

  const handleAction = async (action: "RECOVERY" | "LOCKDOWN" | "RESTORE") => {
    if (!reason.trim()) return;

    setIsLoading(true);
    try {
      if (action === "RECOVERY") {
        await onActivateRecovery(reason);
      } else if (action === "LOCKDOWN") {
        await onActivateLockdown(reason);
      } else if (action === "RESTORE") {
        await onDeactivateLockdown(reason);
      }
      setReason("");
      setConfirmLockdown(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLockdown = currentState === "EMERGENCY_LOCKDOWN";

  return (
    <div className="bg-slate-900 border border-red-900/50 rounded-xl overflow-hidden shadow-2xl shadow-red-900/10">
      <div className="px-6 py-4 border-b border-red-900/30 bg-red-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/50 flex items-center justify-center border border-red-900/50">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Emergency Control Center</h2>
            <p className="text-sm text-red-400">Catastrophic operational governance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              currentState === "OPERATIONAL"
                ? "bg-emerald-500"
                : currentState === "RECOVERY"
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
          />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            {currentState}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recovery Mode Card */}
          <div className="p-5 rounded-lg border border-amber-900/30 bg-amber-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-amber-100">Recovery Mode</h3>
              </div>
              <p className="text-sm text-amber-500/80 mb-4">
                Enable recovery mode to isolate failing subsystems while keeping core platform
                online.
              </p>
            </div>
            <button
              onClick={() => handleAction("RECOVERY")}
              disabled={isLoading || !reason || currentState === "RECOVERY" || isLockdown}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md transition-colors"
            >
              <Power className="w-4 h-4" />
              Activate Recovery
            </button>
          </div>

          {/* Emergency Lockdown Card */}
          <div className="p-5 rounded-lg border border-red-900/30 bg-red-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ServerCrash className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-100">Global Platform Freeze</h3>
              </div>
              <p className="text-sm text-red-400/80 mb-4">
                Instantly freeze all non-essential platform operations and lock out user access.
              </p>
            </div>

            {isLockdown ? (
              <button
                onClick={() => handleAction("RESTORE")}
                disabled={isLoading || !reason}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md transition-colors"
              >
                <ShieldOff className="w-4 h-4" />
                Restore Operations
              </button>
            ) : confirmLockdown ? (
              <button
                onClick={() => handleAction("LOCKDOWN")}
                disabled={isLoading || !reason}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-md transition-colors animate-pulse"
              >
                <Lock className="w-4 h-4" />
                CONFIRM LOCKDOWN
              </button>
            ) : (
              <button
                onClick={() => setConfirmLockdown(true)}
                disabled={isLoading || isLockdown}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-900 text-red-400 text-sm font-semibold rounded-md transition-colors"
              >
                <Lock className="w-4 h-4" />
                Initiate Lockdown
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Mandatory Governance Reason (Audit Enforced)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g., Catastrophic DB failure on primary cluster"
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-md px-4 py-2.5 text-sm focus:outline-hidden focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
