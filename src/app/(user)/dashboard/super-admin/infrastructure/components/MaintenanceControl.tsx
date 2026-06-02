"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import {
  enableMaintenanceMode,
  disableMaintenanceMode,
} from "@/features/super-admin/services/infrastructure/platform-controls";

export function MaintenanceControl({
  isEnabled,
  currentMessage,
}: {
  isEnabled: boolean;
  currentMessage?: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    currentMessage || "Platform is under maintenance. We will be back shortly."
  );
  const [reason, setReason] = useState("");
  const [typedConfirm, setTypedConfirm] = useState("");

  const handleToggle = async () => {
    if (!isEnabled && typedConfirm !== "ENABLE MAINTENANCE") {
      alert("Please type the exact confirmation string to enable maintenance.");
      return;
    }

    setLoading(true);
    try {
      const res = isEnabled
        ? await disableMaintenanceMode(reason || "Disabling maintenance mode")
        : await enableMaintenanceMode(message, reason || "Emergency maintenance enablement");

      if (res.success) {
        setIsConfirming(false);
        setReason("");
        setTypedConfirm("");
      } else {
        alert(res.error || "Failed to update maintenance mode");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl border ${isEnabled ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"} p-6 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#0A1C40] flex items-center gap-2">
            <ShieldAlert className={`w-5 h-5 ${isEnabled ? "text-amber-600" : "text-gray-400"}`} />
            Maintenance Mode
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            When enabled, all users (except SUPER_ADMIN) will be locked out of the platform and see
            the maintenance fallback screen.
          </p>
        </div>

        {!isConfirming ? (
          <button
            onClick={() => setIsConfirming(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEnabled
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isEnabled ? "Manage Maintenance" : "Enable Maintenance"}
          </button>
        ) : (
          <button
            onClick={() => setIsConfirming(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {isConfirming && (
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                {isEnabled
                  ? "You are about to disable maintenance mode and reopen the platform."
                  : "WARNING: Enabling this will immediately lock out all regular users and moderators."}
              </p>
            </div>

            <div className="space-y-4">
              {!isEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Public Maintenance Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={2}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audit Reason (Required)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Database migration, Security patch..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {!isEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <strong>ENABLE MAINTENANCE</strong> to confirm
                  </label>
                  <input
                    type="text"
                    value={typedConfirm}
                    onChange={(e) => setTypedConfirm(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleToggle}
                  disabled={
                    loading || (!isEnabled && typedConfirm !== "ENABLE MAINTENANCE") || !reason
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                    isEnabled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading
                    ? isEnabled
                      ? "Disabling..."
                      : "Enabling..."
                    : isEnabled
                      ? "Disable Maintenance Mode"
                      : "Enable Maintenance Mode"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
