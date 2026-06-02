import { Shield, EyeOff, Ban } from "lucide-react";
import { useState } from "react";
import { pauseChallengeVisibility, disableChallengeAccess } from "@/features/admin/services/live-operations";

interface GovernanceActionsProps {
  challengeId: string;
  isSuperAdmin: boolean;
}

export function GovernanceActions({ challengeId, isSuperAdmin }: GovernanceActionsProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handlePause = async () => {
    if (!isSuperAdmin) return;
    if (!confirm("Are you sure you want to pause visibility? This will set it to PRIVATE.")) return;
    setLoadingAction("pause");
    try {
      await pauseChallengeVisibility(challengeId);
      alert("Challenge visibility paused.");
    } catch (e) {
      alert("Failed to pause challenge.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisable = async () => {
    if (!isSuperAdmin) return;
    if (!confirm("CRITICAL: Disable access? This sets the status to ARCHIVED and blocks attempts."))
      return;
    setLoadingAction("disable");
    try {
      await disableChallengeAccess(challengeId);
      alert("Challenge access disabled.");
    } catch (e) {
      alert("Failed to disable access.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-bold text-red-900">Governance Controls</h3>
      </div>
      <p className="text-xs text-red-700 mb-4">
        {isSuperAdmin
          ? "You have SUPER_ADMIN authority to execute live operational overrides."
          : "These actions require SUPER_ADMIN authority."}
      </p>

      <div className="space-y-2">
        <button
          onClick={handlePause}
          disabled={!isSuperAdmin || loadingAction !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
          {loadingAction === "pause" ? "Pausing..." : "Pause Visibility"}
        </button>
        <button
          onClick={handleDisable}
          disabled={!isSuperAdmin || loadingAction !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white border border-transparent rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <Ban className="w-3.5 h-3.5" />
          {loadingAction === "disable" ? "Disabling..." : "Disable Access"}
        </button>
      </div>
    </div>
  );
}
