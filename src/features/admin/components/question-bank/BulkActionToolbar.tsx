"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { bulkApproveQuestions, bulkRejectQuestions } from "@/features/admin/services/question-bank";

interface BulkActionToolbarProps {
  selectedIds: string[];
  onClear: () => void;
  onComplete: () => void;
}

export function BulkActionToolbar({ selectedIds, onClear, onComplete }: BulkActionToolbarProps) {
  const [isPending, startTransition] = useTransition();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (selectedIds.length === 0) return null;

  const handleBulkApprove = () => {
    setError(null);
    startTransition(async () => {
      const result = await bulkApproveQuestions(selectedIds);
      if (result.success) {
        onClear();
        onComplete();
      } else {
        setError(result.error || "Failed to approve");
      }
    });
  };

  const handleBulkReject = () => {
    if (!rejectReason.trim()) {
      setError("Rejection reason is required");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await bulkRejectQuestions(selectedIds, rejectReason);
      if (result.success) {
        setShowRejectInput(false);
        setRejectReason("");
        onClear();
        onComplete();
      } else {
        setError(result.error || "Failed to reject");
      }
    });
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-indigo-800">{selectedIds.length} selected</span>

      <div className="flex items-center gap-2 ml-auto">
        {showRejectInput ? (
          <>
            <input
              type="text"
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            <button
              onClick={handleBulkReject}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Confirm Reject
            </button>
            <button
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason("");
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleBulkApprove}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Approve All
            </button>
            <button
              onClick={() => setShowRejectInput(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject All
            </button>
          </>
        )}
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
        >
          Clear
        </button>
      </div>

      {error && <p className="w-full text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
