"use client";

import { useState } from "react";
import { performModerationAction } from "@/actions/manage/user-management";
import { Ban, PlayCircle, AlertTriangle, Flag, XCircle, CheckCircle } from "lucide-react";

interface UserProfileActionsProps {
  user: {
    id: string;
    accountState: string;
    role: string;
  };
}

export function UserProfileActions({ user }: UserProfileActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleAction = async (
    action: "suspend" | "reactivate" | "ban" | "unban" | "flag" | "unflag",
    reason?: string
  ) => {
    setLoading(action);
    try {
      const result = await performModerationAction({
        userId: user.id,
        action,
        reason,
      });
      if (!result.success) {
        alert(result.error || "Action failed");
      } else {
        window.location.reload();
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(null);
      setShowConfirm(null);
    }
  };

  const isBannedOrSuspended = user.accountState === "BANNED" || user.accountState === "SUSPENDED";
  const isUser = user.role === "USER";

  return (
    <div className="flex flex-wrap gap-2">
      {user.accountState === "ACTIVE" && isUser && (
        <>
          <button
            onClick={() => setShowConfirm("suspend")}
            disabled={loading === "suspend"}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            {loading === "suspend" ? "Suspending..." : "Suspend"}
          </button>
          <button
            onClick={() => setShowConfirm("ban")}
            disabled={loading === "ban"}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Ban className="w-4 h-4" />
            {loading === "ban" ? "Banning..." : "Ban"}
          </button>
          <button
            onClick={() => handleAction("flag")}
            disabled={loading === "flag"}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            {loading === "flag" ? "Flagging..." : "Flag"}
          </button>
        </>
      )}

      {user.accountState === "SUSPENDED" && isUser && (
        <>
          <button
            onClick={() => handleAction("reactivate")}
            disabled={loading === "reactivate"}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            {loading === "reactivate" ? "Reactivating..." : "Reactivate"}
          </button>
          <button
            onClick={() => setShowConfirm("ban")}
            disabled={loading === "ban"}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Ban className="w-4 h-4" />
            {loading === "ban" ? "Banning..." : "Ban"}
          </button>
        </>
      )}

      {user.accountState === "BANNED" && isUser && (
        <button
          onClick={() => handleAction("unban")}
          disabled={loading === "unban"}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {loading === "unban" ? "Unbanning..." : "Lift Ban"}
        </button>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#0A1C40] mb-2">
              {showConfirm === "suspend" ? "Confirm Suspension" : "Confirm Ban"}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {showConfirm === "suspend"
                ? "This will temporarily suspend the user's account."
                : "This will permanently ban the user from the platform."}
            </p>
            <textarea
              id="reason"
              placeholder="Reason for this action (optional)..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = (document.getElementById("reason") as HTMLTextAreaElement)?.value;
                  handleAction(showConfirm as "suspend" | "ban", reason);
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  showConfirm === "suspend"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
